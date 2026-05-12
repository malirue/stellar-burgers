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
    cy.visit('/');

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
