describe('API ингредиентов — моковые данные', () => {
  beforeEach(() => {
    // Перехватываем запрос
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'api/ingredients/ingredients.json'
    }).as('getIngredients');

    // Открываем страницу
    cy.visit('/');

    // Ждём перехваченного запроса
    cy.wait('@getIngredients');
  });

  it('При открытии страницы должен загрузить ингредиенты с моковыми данными', () => {
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
    // Перехватываем запрос
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'api/ingredients/ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    });

    // Открываем страницу
    cy.visit('/');

    // Ждём загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  it('Добавление булки в конструктор (автоматически становится верхней и нижней)', () => {
    cy.get('[data-testid="ingredient-card"]').should('have.length.at.least', 3);

    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    cy.get('[data-testid="constructor-bun-top"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Булка с кунжутом (верх)').should('be.visible');
      });

    cy.get('[data-testid="constructor-bun-bottom"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Булка с кунжутом (низ)').should('be.visible');
      });

    // Сравнение названий булок
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

    // Проверка состояния через store
    cy.window().then((win) => {
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
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    const fillings = ['Котлета из говядины', 'Помидор', 'Сыр голландский'];

    fillings.forEach((filling, index) => {
      cy.contains(filling)
        .parent('[data-testid="ingredient-card"]')
        .find('button')
        .click({ force: true });

      cy.get('[data-testid="constructor-fillings"]')
        .should('exist')
        .find('li')
        .eq(index)
        .within(() => {
          cy.contains(filling).should('exist');
        });
    });

    cy.get('[data-testid="constructor-fillings"]')
      .find('li')
      .should('have.length', 3);

    cy.window().then((win) => {
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
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    const fillings = ['Котлета из говядины', 'Помидор', 'Сыр голландский'];
    fillings.forEach((filling) => {
      cy.contains(filling)
        .parent('[data-testid="ingredient-card"]')
        .find('button')
        .click({ force: true });
    });

    cy.window().then((win) => {
      const state = win.store?.getState?.();
      if (state) {
        const price = state.burgerConstructor?.price;
        // 2 булки (2 × 100) + 3 начинки (200 + 50 + 80) = 530
        expect(price).to.equal(530);
      }
    });

    cy.get('[data-testid="total-price-container"]')
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
    // Перехватываем запрос
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'api/ingredients/ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Открытие модального окна ингредиента по клику на карточку', () => {
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .click();

    cy.url().should('include', 'http://localhost:4000/ingredients/');
    cy.contains('Детали ингредиента').should('be.visible');

    cy.get('[data-testid="modal"]').within(() => {
      cy.contains('Булка с кунжутом').should('be.visible');
    });

    cy.contains('.text', 'Калории, ккал').should('be.visible');
    cy.contains('.text', 'Белки, г').should('be.visible');
    cy.contains('.text', 'Жиры, г').should('be.visible');
    cy.contains('.text', 'Углеводы, г').should('be.visible');
  });

  it('Закрытие модального окна ингредиента по клику на крестик', () => {
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .click();

    cy.get('[data-testid="modal-close-button"]').should('be.visible').click();

    cy.get('div[class*="overlay"]').should('not.exist');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('Закрытие модального окна ингредиента по клику на оверлей', () => {
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .click();

    cy.get('[data-testid="modal"]').should('be.visible');

    cy.get('[data-testid="overlay"]').click('topLeft', {
      force: true
    });

    cy.get('[data-testid="modal"]').should('not.exist');
    cy.get('[data-testid="overlay"]').should('not.exist');
    cy.url().should('eq', 'http://localhost:4000/');
  });

  it('Содержимое модального окна соответствует выбранному ингредиенту', () => {
    const ingredientsToTest = [
      { name: 'Булка с кунжутом', calories: 420 },
      { name: 'Котлета из говядины', calories: 280 }
    ];

    ingredientsToTest.forEach((ingredient) => {
      cy.contains(ingredient.name)
        .parent('[data-testid="ingredient-card"]')
        .click();

      // Ищем строго внутри модалки
      cy.get('[data-testid="modal"]').within(() => {
        cy.contains(ingredient.name).should('be.visible');
        cy.get('[data-testid="calorie-value"]').should(
          'contain',
          ingredient.calories
        );
      });

      cy.get('[data-testid="modal-close-button"]').click();
      cy.wait(500);
    });
  });
});

describe('Создание заказа в бургерном конструкторе', () => {
  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  beforeEach(() => {
    cy.setCookie('accessToken', 'Bearer mock-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'api/auth/user-data.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'api/orders/create-order-success.json'
    }).as('createOrder');

    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'api/ingredients/ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getUser');
    cy.wait('@getIngredients');
  });

  it('Должен успешно создать заказ, открыть модальное окно с номером заказа, закрыть его и очистить конструктор', () => {
    cy.get('[data-testid="ingredient-card"]').should('have.length.at.least', 3);

    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    const fillings = ['Котлета из говядины', 'Помидор', 'Сыр голландский'];

    fillings.forEach((filling, index) => {
      cy.contains(filling)
        .parent('[data-testid="ingredient-card"]')
        .find('button')
        .click({ force: true });
    });

    cy.contains('Оформить заказ').click({ force: true });
    cy.wait('@createOrder');

    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('[data-testid="order-id"]', '12345').should('be.visible');

    cy.get('[data-testid="modal-close-button"]').should('be.visible').click();
    cy.wait(500);

    // Ищем плейсхолдеры пустого конструктора
    cy.get('[data-testid="no-buns-top"]').should('be.visible');

    cy.get('[data-testid="no-buns-bottom"]').should('be.visible');

    // Убеждаемся, что список начинок пуст
    cy.get('[data-testid="no-fillings"]')
      .should('exist')
      .then(($list) => {
        expect($list.find('li').length).to.eq(0);
      });
  });

  it('Не должен создавать заказ при пустом конструкторе', () => {
    cy.intercept('POST', '**/api/orders').as('createEmptyOrder');
    cy.contains('Оформить заказ').should('be.enabled').click({ force: true });

    cy.wait(1000);

    cy.get('@createEmptyOrder.all').then((interceptions) => {
      expect(interceptions).to.have.length(0);
    });
  });

  it('Не должен создавать заказ для неавторизованного пользователя', () => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');

    // Перехватываем запрос
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    }).as('getUserUnauthorized');

    cy.visit('/');
    cy.wait('@getUserUnauthorized');

    // Добавляем ингредиенты
    cy.contains('Булка с кунжутом')
      .parent('[data-testid="ingredient-card"]')
      .find('button')
      .click({ force: true });

    const fillings = ['Котлета из говядины', 'Помидор', 'Сыр голландский'];
    fillings.forEach((filling) => {
      cy.contains(filling)
        .parent('[data-testid="ingredient-card"]')
        .find('button')
        .click({ force: true });
    });

    // Нажимаем «Оформить заказ»
    cy.contains('Оформить заказ').should('be.enabled').click({ force: true });

    // Ждём редирект на страницу логина
    cy.url().should('include', '/login');
  });
});
