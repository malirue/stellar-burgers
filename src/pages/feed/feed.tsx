import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchFeed, updateFeed } from '.././../services/slices/feedSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const { orders, isLoading, error } = useAppSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed());

    const socket = new WebSocket(
      'wss://norma.education-services.ru/api/orders/all'
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.order) {
        dispatch(updateFeed(data.order));
      }
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-medium text_color_error p-4'>
        {error}
      </div>
    );
  }

  if (!orders.length && !isLoading) {
    return (
      <div className='text text_type_main-medium p-4'>Заказы не найдены</div>
    );
  }

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
