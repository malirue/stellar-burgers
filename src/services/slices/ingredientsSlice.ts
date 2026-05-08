import { getIngredientByIdApi, getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      return rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

export const fetchIngredientById = createAsyncThunk(
  'ingredients/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const ingredient = await getIngredientByIdApi(id);
      return ingredient;
    } catch (error) {
      return rejectWithValue(`Ошибка загрузки ингредиента с ID ${id}`);
    }
  }
);

interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectLoading = (state: RootState) => state.ingredients.isLoading;
export const selectError = (state: RootState) => state.ingredients.error;

export default ingredientsSlice.reducer;
