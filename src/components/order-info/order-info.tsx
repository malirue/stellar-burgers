import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectOrdersError,
  selectOrdersLoading
} from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  console.log('OrderInfo rendered, number:', number);
  const dispatch = useAppDispatch();

  // Берём данные из стора
  const orderData = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const isLoading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);

  useEffect(() => {
    console.log('OrderInfo mounted, number:', number);
    if (number) {
      console.log('Dispatching fetchOrderByNumber with:', Number(number));
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
