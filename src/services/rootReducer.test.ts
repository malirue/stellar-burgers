import { rootReducer } from './store';

// Тест для проверки инициализации rootReducer
describe('rootReducer', () => {
  it('должен правильно инициализировать состояние store', () => {
    const initialState = rootReducer(undefined, { type: '' });

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('feed');

    // Проверяем начальное состояние burgerConstructor
    expect(initialState.burgerConstructor).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null,
      orderError: null
    });
  });
});
