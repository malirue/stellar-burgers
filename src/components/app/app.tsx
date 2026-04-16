import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { Preloader } from '@ui';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  fetchIngredients,
  RootState,
  useAppDispatch,
  useAppSelector
} from '@services';

const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isIngredientsLoading = useAppSelector(
    (state: RootState) => state.ingredients.isLoading
  );

  const isModalOpen = useMemo(
    () =>
      location.pathname.startsWith('/feed/') ||
      location.pathname.startsWith('/ingredients/') ||
      location.pathname.startsWith('/profile/orders/'),
    [location.pathname]
  );
  // было;

  // const isModalOpen =
  //   location.pathname.startsWith('/feed/') ||
  //   location.pathname.startsWith('/ingredients/') ||
  //   location.pathname.startsWith('/profile/orders/');

  // console.warn('isModalOpen', isModalOpen);

  const backgroundLocation = useMemo(() => {
    if (location.state?.background) {
      return location.state.background;
    }
    return location.pathname;
  }, [location]);
  console.error('location', location);

  const error = useAppSelector((state: RootState) => state.ingredients.error);

  const { isLoading: isAuthLoading } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isAuthLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          {/* ОСНОВНЫЕ МАРШРУТЫ — рендерим только фон */}
          <Routes key='main' location={backgroundLocation}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            {/* 404 — только для основных маршрутов */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* МОДАЛЬНЫЕ ОКНА — рендерим поверх фона */}
          {isModalOpen && (
            <div className={styles.modalOverlay}>
              <Routes key='modal'>
                <Route
                  path='/feed/:number'
                  element={
                    <Modal
                      title='Информация о заказе'
                      onClose={() => navigate(-1)}
                    >
                      <OrderInfo />
                    </Modal>
                  }
                />
                <Route
                  path='/ingredients/:id'
                  element={
                    <Modal
                      title='Детали ингредиента'
                      onClose={() => navigate(-1)}
                    >
                      <IngredientDetails />
                    </Modal>
                  }
                />
                <Route
                  path='/profile/orders/:number'
                  element={
                    <Modal
                      title='Информация о заказе'
                      onClose={() =>
                        navigate('/profile/orders', { replace: true })
                      }
                    >
                      <OrderInfo />
                    </Modal>
                  }
                />
              </Routes>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
