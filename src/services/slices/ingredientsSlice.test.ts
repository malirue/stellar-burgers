import { TIngredient } from '@utils-types';
import { fetchIngredients, ingredientsSlice } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = ingredientsSlice.getInitialState();

  describe('extraReducers для fetchIngredients', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять ингредиенты и устанавливать isLoading в false при fulfilled', () => {
      const mockIngredients: TIngredient[] = [
        {
          _id: '1',
          name: 'Ингредиент 1',
          type: 'main',
          price: 100,
          image: '',
          image_mobile: '',
          calories: 0,
          carbohydrates: 0,
          fat: 0,
          proteins: 0
        },
        {
          _id: '2',
          name: 'Ингредиент 2',
          type: 'main',
          price: 150,
          image: '',
          image_mobile: '',
          calories: 0,
          carbohydrates: 0,
          fat: 0,
          proteins: 0
        }
      ];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.items).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});
