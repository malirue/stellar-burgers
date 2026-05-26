import {
  clearCurrentOrder,
  fetchFeedOrders,
  fetchOrderByNumber,
  fetchUserOrders,
  ordersSlice
} from './ordersSlice';

describe('ordersSlice', () => {
  const initialState = ordersSlice.getInitialState();

  describe('редьюсеры', () => {
    it('должен очищать текущий заказ', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: {
          _id: '1',
          ingredients: [],
          name: 'Test Order',
          number: 123,
          status: 'created',
          updatedAt: '',
          createdAt: ''
        }
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
      const mockOrders = [
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
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.userOrders).toEqual(mockOrders);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: {
          message: errorMessage
        }
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
      const mockFeedOrders = [
        {
          _id: '1',
          ingredients: [],
          name: 'Feed Order 1',
          number: 125,
          status: 'created',
          updatedAt: '',
          createdAt: ''
        }
      ];
      const action = {
        type: fetchFeedOrders.fulfilled.type,
        payload: { orders: mockFeedOrders }
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.feedOrders).toEqual(mockFeedOrders);
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
      const mockOrder = {
        _id: '1',
        ingredients: [],
        name: 'Single Order',
        number: 126,
        status: 'created',
        updatedAt: '',
        createdAt: ''
      };
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.currentOrder).toEqual(mockOrder);
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
