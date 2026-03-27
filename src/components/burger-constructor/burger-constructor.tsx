import { FC, useCallback, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { ConstructorItems } from '../ui/burger-constructor/type';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  setOrderRequest,
  setBun,
  addIngredient,
  fetchOrder,
  resetConstructor
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const dispatch = useAppDispatch();

  const { constructorItems, orderRequest, orderModalData } = useAppSelector(
    (state) => state.burgerConstructor
  );

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest) return;

    dispatch(setOrderRequest(true));

    const ingredientIds = constructorItems.ingredients.map((item) => item._id);
    const orderData = [
      constructorItems.bun._id,
      ...ingredientIds,
      constructorItems.bun._id
    ];
    dispatch(fetchOrder(orderData));
  }, [dispatch, constructorItems, orderRequest]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetConstructor());
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
