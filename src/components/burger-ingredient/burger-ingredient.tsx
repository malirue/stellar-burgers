import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useAppDispatch } from '../../services/store';
import {
  addIngredient,
  setBun
} from '../../services/slices/burgerConstructorSlice';
import { TBun, TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (ingredient.type === 'bun') {
        const bun: TBun = {
          ...ingredient,
          type: 'bun'
        };
        dispatch(setBun(bun));
      } else {
        const ingredientWithId: TConstructorIngredient = {
          ...ingredient,
          id: ingredient._id
        };
        dispatch(addIngredient(ingredientWithId));
      }
    };
    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
