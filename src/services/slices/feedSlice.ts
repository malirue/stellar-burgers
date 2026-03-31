import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { getFeedsApi, getOrdersApi } from '@api';

interface FeedResponse {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Асинхронный экшен для загрузки ленты заказов
export const fetchFeed = createAsyncThunk<
  FeedResponse,
  void,
  { rejectValue: string }
>('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response: FeedResponse = await getFeedsApi();
    console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    return rejectWithValue('Ошибка загрузки ленты заказов');
  }
});

// Экшен для обновления ленты в реальном времени (WebSocket)
export const updateFeed = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  TOrder,
  { state: RootState }
>('feed/updateFeed', async (newOrder, { getState }) => {
  const state = getState() as RootState;
  const currentOrders = state.feed.orders;

  return {
    orders: [newOrder, ...currentOrders],
    total: state.feed.total + 1,
    totalToday: state.feed.totalToday + 1
  };
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const { resetFeed } = feedSlice.actions;
export default feedSlice.reducer;
