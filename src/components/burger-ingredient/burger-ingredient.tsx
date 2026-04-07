import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as randomUUID } from 'uuid';
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

    const handleAdd = (e: React.SyntheticEvent<Element, Event>) => {
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
          id: randomUUID()
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
