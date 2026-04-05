import { FC, useCallback, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  fetchOrder,
  resetConstructor,
  setOrderRequest,
  useAppDispatch,
  useAppSelector
} from '@services';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { constructorItems, orderRequest, orderModalData } = useAppSelector(
    (state) => state.burgerConstructor
  );

  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
