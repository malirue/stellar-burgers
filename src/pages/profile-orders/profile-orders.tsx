import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, memo, useEffect } from 'react';

import { Preloader } from '@ui';
import {
  fetchUserOrders,
  RootState,
  useAppDispatch,
  useAppSelector
} from '@services';

export const ProfileOrders: FC = memo(() => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector(
    (state: RootState) => state.orders.userOrders
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.orders.isLoading
  );

  const isAuthenticated = useAppSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthenticated]);

  console.log('isLoading', isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
});
