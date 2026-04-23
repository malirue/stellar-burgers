import { getOrdersApi, orderBurgerApi, TNewOrderResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TBun, TConstructorIngredient, TOrder } from '@utils-types';
import { ConstructorItems } from '@ui/burger-constructor';

interface BurgerConstructorState {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
}

const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    setBun: (state, action: PayloadAction<TBun>) => {
      state.constructorItems.bun = action.payload;
    },
    removeIngredient: (state, action: PayloadAction<{ index: number }>) => {
      state.constructorItems.ingredients.splice(action.payload.index, 1);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredient = state.constructorItems.ingredients[fromIndex];
      state.constructorItems.ingredients.splice(fromIndex, 1);
      state.constructorItems.ingredients.splice(toIndex, 0, ingredient);
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },

    resetConstructor: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order as any;
        state.orderRequest = false;
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      });
  }
});

export const fetchOrder = createAsyncThunk(
  'burgerConstructor/fetchOrder',
  async (data: string[], { rejectWithValue }): Promise<TNewOrderResponse> => {
    try {
      const response = await orderBurgerApi(data);

      if (Array.isArray(response) && response.length > 0) {
        return response[0];
      }
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка оформления заказа') as any;
    }
  }
);

export const {
  addIngredient,
  setBun,
  removeIngredient,
  moveIngredient,
  setOrderRequest,
  resetConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
