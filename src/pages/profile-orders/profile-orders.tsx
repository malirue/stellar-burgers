import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '.././../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector(
    (state: RootState) => state.orders.userOrders
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.orders.isLoading
  );

  const error = useAppSelector((state: RootState) => state.orders.error);
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
