import { TOrder } from '@utils-types';
import {
  clearCurrentOrder,
  fetchFeedOrders,
  fetchOrderByNumber,
  fetchUserOrders,
  ordersSlice
} from './ordersSlice';

describe('ordersSlice', () => {
  const initialState = ordersSlice.getInitialState();

  // Вспомогательные константы для переиспользования
  const MOCK_ORDER: TOrder = {
    _id: '1',
    ingredients: [],
    name: 'Test Order',
    number: 123,
    status: 'created',
    updatedAt: '',
    createdAt: ''
  };

  const MOCK_ORDERS: TOrder[] = [
    {
      _id: '1',
      ingredients: [],
      name: 'Order 1',
      number: 123,
      status: 'created',
      updatedAt: '',
      createdAt: ''
    },
    {
      _id: '2',
      ingredients: [],
      name: 'Order 2',
      number: 124,
      status: 'created',
      updatedAt: '',
      createdAt: ''
    }
  ];

  describe('редьюсеры', () => {
    it('должен очищать текущий заказ', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: MOCK_ORDER
      };
      const action = clearCurrentOrder();
      const state = ordersSlice.reducer(stateWithOrder, action);

      expect(state.currentOrder).toBeNull();
    });
  });

  describe('extraReducers для fetchUserOrders', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять пользовательские заказы и устанавливать isLoading в false при fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: MOCK_ORDERS
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.userOrders).toEqual(MOCK_ORDERS);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки пользовательских заказов';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: errorMessage
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.userOrders).toEqual([]);
    });
  });

  describe('extraReducers для fetchFeedOrders', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchFeedOrders.pending.type };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять заказы ленты и устанавливать isLoading в false при fulfilled', () => {
      const mockFeedOrders = [MOCK_ORDER];
      const action = {
        type: fetchFeedOrders.fulfilled.type,
        payload: { orders: mockFeedOrders }
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.feedOrders).toEqual(mockFeedOrders);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const action = {
        type: fetchFeedOrders.rejected.type,
        payload: errorMessage
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('extraReducers для fetchOrderByNumber', () => {
    it('должен очищать ошибку при pending', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: fetchOrderByNumber.pending.type };
      const state = ordersSlice.reducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('должен сохранять текущий заказ при fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: MOCK_ORDER
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.currentOrder).toEqual(MOCK_ORDER);
    });

    it('должен сохранять ошибку при rejected', () => {
      const errorMessage = 'Заказ не найден';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
    });
  });
});
