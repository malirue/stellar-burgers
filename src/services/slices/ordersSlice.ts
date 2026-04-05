import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      // console.error('Полная ошибка загрузки заказов:', error);
      return rejectWithValue('Ошибка загрузки заказов');
    }
  }
);

// Thunk для получения ленты заказов
export const fetchFeedOrders = createAsyncThunk(
  'orders/fetchFeedOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue('Ошибка загрузки ленты заказов');
    }
  }
);

// Thunk для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue('Заказ не найден');
    }
  }
);

interface OrdersState {
  userOrders: TOrder[];
  feedOrders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  userOrders: [],
  feedOrders: [],
  currentOrder: null,
  isLoading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload ?? [];
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки пользовательских заказов';
        state.userOrders = [];
      })
      .addCase(fetchFeedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.feedOrders = action.payload.orders;
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    //   .addMatcher(
    //     (action) => action.type.endsWith('/rejected'),
    //     (state, action) => {
    //       state.isLoading = false;
    //       state.error = action.payload as string;
    //     }
    //   );
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;

// Селекторы
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectFeedOrders = (state: RootState) => state.orders.feedOrders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;

export default ordersSlice.reducer;
