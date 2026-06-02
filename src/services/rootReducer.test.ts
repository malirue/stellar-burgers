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

    // остальные редьюсеры

    // Проверяем начальное состояние ingredients
    expect(initialState.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });

    // Проверяем начальное состояние orders
    expect(initialState.orders).toEqual({
      userOrders: [],
      feedOrders: [],
      currentOrder: null,
      isLoading: false,
      error: null
    });

    // Проверяем начальное состояние user (profileSlice)
    expect(initialState.user).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null
    });

    // Проверяем начальное состояние feed
    expect(initialState.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });
});
