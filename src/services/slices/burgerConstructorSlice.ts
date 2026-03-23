import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TBun, TConstructorIngredient, TOrder } from '@utils-types';
import { ConstructorItems } from 'src/components/ui/burger-constructor/type';

interface BurgerConstructorState {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload as TBun;
      } else {
        console.warn(
          'Попытка установить не булочку как булочку:',
          action.payload
        );
      }
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
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
    resetConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
    }
  }
});

export const {
  addIngredient,
  setBun,
  removeIngredient,
  moveIngredient,
  setOrderRequest,
  setOrderModalData,
  resetConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
