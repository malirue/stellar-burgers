import { feedSlice, fetchFeed, resetFeed, updateFeed } from './feedSlice';

describe('feedSlice', () => {
  const initialState = feedSlice.getInitialState();

  describe('редьюсеры', () => {
    it('должен сбрасывать ленту заказов', () => {
      const stateWithData = {
        ...initialState,
        orders: [
          {
            _id: '1',
            ingredients: [],
            name: 'Order',
            number: 127,
            status: 'created',
            updatedAt: '',
            createdAt: ''
          }
        ],
        total: 5,
        totalToday: 2
      };
      const action = resetFeed();
      const state = feedSlice.reducer(stateWithData, action);

      expect(state.orders).toHaveLength(0);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  describe('extraReducers для fetchFeed', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchFeed.pending.type };
      const state = feedSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять данные ленты и устанавливать isLoading в false при fulfilled', () => {
      const mockFeedData = {
        orders: [
          {
            _id: '1',
            ingredients: [],
            name: 'Feed Order',
            number: 128,
            status: 'created',
            updatedAt: '',
            createdAt: ''
          }
        ],
        total: 10,
        totalToday: 3
      };
      const action = { type: fetchFeed.fulfilled.type, payload: mockFeedData };
      const state = feedSlice.reducer(initialState, action);

      expect(state.orders).toEqual(mockFeedData.orders);
      expect(state.total).toBe(mockFeedData.total);
      expect(state.totalToday).toBe(mockFeedData.totalToday);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const action = { type: fetchFeed.rejected.type, payload: errorMessage };
      const state = feedSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('extraReducers для updateFeed', () => {
    it('должен обновлять ленту заказов при fulfilled', () => {
      const existingOrders = [
        {
          _id: '2',
          ingredients: [],
          name: 'Existing Order',
          number: 129,
          status: 'created',
          updatedAt: '',
          createdAt: ''
        }
      ];
      const newOrder = {
        _id: '1',
        ingredients: [],
        name: 'New Order',
        number: 130,
        status: 'created',
        updatedAt: '',
        createdAt: ''
      };

      const stateWithExistingOrders = {
        ...initialState,
        orders: existingOrders,
        total: 5,
        totalToday: 2
      };

      const action = {
        type: updateFeed.fulfilled.type,
        payload: {
          orders: [newOrder, ...existingOrders],
          total: 6,
          totalToday: 3
        }
      };
      const state = feedSlice.reducer(stateWithExistingOrders, action);

      expect(state.orders[0]).toEqual(newOrder);
      expect(state.total).toBe(6);
      expect(state.totalToday).toBe(3);
    });
  });
});
