import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchIngredientById } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const ingredientData = useAppSelector((state) =>
    state.ingredients.items.find((item) => item._id === id)
  );
  const isLoading = useAppSelector((state) => state.ingredients.isLoading);
  const error = useAppSelector((state) => state.ingredients.error);

  useEffect(() => {
    if (id && !ingredientData) {
      dispatch(fetchIngredientById(id));
    }
  }, [id, ingredientData, dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
