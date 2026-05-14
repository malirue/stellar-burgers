// здесь будут мои тесты

//тест того, что cypress работает
// describe('Базовый тест Cypress', () => {
//   it('Должен открыть страницу и проверить заголовок', () => {
//     cy.visit('https://example.com');
//     cy.title().should('include', 'Example Domain');
//   });

//   it('Должен найти элемент на странице', () => {
//     cy.visit('https://example.com');
//     cy.contains('Example Domain').should('be.visible');
//   });
// });

describe('API ингредиентов — моковые данные', () => {
  beforeEach(() => {
    // Открываем главную страницу приложения
    cy.visit('/');

    // Перехватываем запрос к API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  it('Должен загрузить ингредиенты с моковыми данными', () => {
    cy.wait('@getIngredients').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.body.success).to.be.true;
      expect(interception.response?.body.data).to.have.length.greaterThan(0);
    });

    // Проверяем что все ингредиенты в нужных количествах на своих местах
    cy.get('[data-testid="ingredient-card"]').should('have.length', 4);

    cy.contains('Булка с кунжутом').should('exist');
    cy.contains('Котлета из говядины').should('exist');
    cy.contains('Помидор').should('exist');
    cy.contains('Сыр голландский').should('exist');
  });

  it('Проверка структуры данных ингредиентов', () => {
    cy.wait('@getIngredients');

    cy.window().then((win) => {
      const state = win.store?.getState?.();
      if (state) {
        const ingredients = state.ingredients?.items;
        expect(ingredients).to.have.length(4);
        expect(ingredients[0]).to.have.property('name', 'Булка с кунжутом');
        expect(ingredients[0]).to.have.property('type', 'bun');
        expect(ingredients[1]).to.have.property('name', 'Котлета из говядины');
        expect(ingredients[1]).to.have.property('price', 200);
      }
    });
  });
});

describe('Конструктор бургеров — добавление ингредиентов (без авторизации)', () => {
  beforeEach(() => {
    // Перехватываем запросы к API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Игнорируем запросы авторизации
    // А надо ли?
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    });

    // Открываем страницу
    cy.visit('/');

    // Ждём загрузки ингредиентов
    cy.wait('@getIngredients', { timeout: 10000 });
  });

  it('Добавление булки в конструктор (автоматически становится верхней и нижней)', () => {
    // Проверяем, что ингредиенты загружены
    cy.get('[data-testid="ingredient-card"]', { timeout: 15000 }).should(
      'have.length.at.least',
      3
    );

    // Находим булку и добавляем один раз
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    // Проверяем появление верхней булки
    cy.get('[data-testid="constructor-bun-top"]', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.contains('Булка с кунжутом (верх)').should('be.visible');
      });

    // Проверяем появление нижней булки
    cy.get('[data-testid="constructor-bun-bottom"]', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.contains('Булка с кунжутом (низ)').should('be.visible');
      });

    // Проверяем, что булки одинаковые
    cy.get('[data-testid="constructor-bun-top"]')
      .find('.constructor-element__text')
      .invoke('text')
      .then((topBunText) => {
        const topBunName = topBunText.replace(' (верх)', '').trim();

        cy.get('[data-testid="constructor-bun-bottom"]')
          .find('.constructor-element__text')
          .invoke('text')
          .then((bottomBunText) => {
            const bottomBunName = bottomBunText.replace(' (низ)', '').trim();
            expect(topBunName).to.equal(bottomBunName);
          });
      });

    // Проверяем состояние
    cy.window().then((win) => {
      cy.wait(2000);
      const state = win.store?.getState?.();
      if (state) {
        const constructorItems = state.burgerConstructor?.constructorItems;
        expect(constructorItems.bun).to.not.be.null;
        expect(constructorItems.bun.name).to.equal('Булка с кунжутом');
        expect(constructorItems.bun._id).to.exist;
      }
    });
  });

  it('Добавление начинок в конструктор', () => {
    // Добавляем булку
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    const fillings = ['Котлета из говядины', 'Помидор', 'Сыр голландский'];

    fillings.forEach((filling, index) => {
      // Находим начинку и добавляем
      cy.contains(filling)
        .parent('[data-testid="ingredient-card"]')
        .find('button')
        .click({ force: true });

      // Проверяем добавление начинки в конструкторе
      cy.get('[data-testid="constructor-fillings"]', { timeout: 12000 })
        .should('exist')
        .find('li')
        .eq(index)
        .within(() => {
          cy.contains(filling).should('exist');
        });
    });

    // Проверяем общее количество начинок
    cy.get('[data-testid="constructor-fillings"]')
      .find('li')
      .should('have.length', 3);

    // Проверяем состояние
    cy.window().then((win) => {
      cy.wait(1500);
      const state = win.store?.getState?.();
      if (state) {
        const ingredients =
          state.burgerConstructor?.constructorItems?.ingredients;
        expect(ingredients).to.have.length(3);
        expect(ingredients[0].name).to.equal('Котлета из говядины');
        expect(ingredients[1].name).to.equal('Помидор');
        expect(ingredients[2].name).to.equal('Сыр голландский');
      }
    });
  });

  it('Расчёт стоимости при добавлении ингредиентов', () => {
    // Добавляем булку один раз
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    // Добавляем начинки
    const fillings = ['Котлета из говядины', 'Помидор', 'Сыр голландский'];
    fillings.forEach((filling) => {
      cy.contains(filling)
        .parent('[data-testid="ingredient-card"]')
        .find('button')
        .click({ force: true });
    });

    // Проверяем расчёт стоимости
    cy.window().then((win) => {
      cy.wait(2500);
      const state = win.store?.getState?.();
      if (state) {
        const price = state.burgerConstructor?.price;
        // Ожидаемая цена: 2 булки (2 × 100) + 3 начинки (200 + 50 + 80) = 530
        expect(price).to.equal(530);
      }
    });

    // Проверяем отображение цены
    cy.get('[data-testid="total-price-container"]', { timeout: 15000 })
      .find('p')
      .invoke('text')
      .then((text) => {
        const displayedPrice = parseInt(text.trim(), 10);
        expect(displayedPrice).to.equal(530);
      });
  });
});

describe('Модальные окна — тестирование функциональности', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients', { timeout: 10000 });
  });

  it('Открытие модального окна ингредиента по клику на карточку', () => {
    // Находим карточку ингредиента и кликаем
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .click();

    // Ждём изменения URL
    cy.url().should('include', '/ingredients/');

    // Проверяем заголовок модального окна
    cy.contains('Детали ингредиента').should('be.visible');

    // Проверяем видимость содержимого ингредиента с явным ожиданием
    cy.contains('Булка с кунжутом', { timeout: 5000 }).should('be.visible');

    // Проверяем наличие кбжу
    cy.contains('.text', 'Калории, ккал').should('be.visible');
    cy.contains('.text', 'Белки, г').should('be.visible');
    cy.contains('.text', 'Жиры, г').should('be.visible');
    cy.contains('.text', 'Углеводы, г').should('be.visible');
  });

  it('Закрытие модального окна ингредиента по клику на крестик', () => {
    // Открываем модальное окно
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .click();

    // Ждём появления крестика и кликаем
    cy.get('[data-testid="modal-close-button"]').should('be.visible').click();

    // Проверяем закрытие модалки
    cy.get('div[class*="overlay"]').should('not.exist');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('Закрытие модального окна ингредиента по клику на оверлей', () => {
    // Открываем модалку
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .click();

    // Ждём появления
    cy.get('[ data-testid="modal"]')
      .should('be.visible')
      .click('topLeft', { force: true });

    // Находим оверлей и кликаем
    cy.get('[data-testid="overlay"]', { timeout: 15000 }).click('topLeft', {
      force: true
    });

    // Проверяем закрытие
    cy.get('[ data-testid="modal"]').should('not.exist');
    cy.get('[data-testid="overlay"]').should('not.exist');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('Содержимое модального окна соответствует выбранному ингредиенту', () => {
    const ingredientsToTest = [
      { name: 'Булка с кунжутом', calories: 420 },
      { name: 'Котлета из говядины', calories: 280 }
    ];

    ingredientsToTest.forEach((ingredient) => {
      // Открываем модалку для конкретного ингредиента
      cy.contains(ingredient.name)
        .parent('[data-testid="ingredient-card"]')
        .click();

      // Проверяем название ингредиента
      cy.contains(ingredient.name, { timeout: 5000 }).should('be.visible');

      // Проверяем калорийность
      cy.get('[data-testid="calorie-value"]').should(
        'contain',
        ingredient.calories
      );

      // Закрываем
      cy.get('[data-testid="modal-close-button"]').click();
      cy.wait(500);
    });
  });
});
