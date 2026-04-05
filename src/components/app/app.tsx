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

import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  fetchIngredients,
  RootState,
  useAppDispatch,
  useAppSelector
} from '@services';

const App = () => {
  const dispatch = useAppDispatch();

  const isIngredientsLoading = useAppSelector(
    (state: RootState) => state.ingredients.isLoading
  );
  const error = useAppSelector((state: RootState) => state.ingredients.error);

  const { isLoading: isAuthLoading } = useAppSelector(
    (state: RootState) => state.user
  );

  const navigate = useNavigate();

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
        <Routes>
          {/* ОСНОВНЫЕ МАРШРУТЫ */}
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          {/* ЗАЩИЩЁННЫЕ МАРШРУТЫ */}
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

          {/* МОДАЛЬНЫЕ ОКНА */}
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Информация о заказе'
                onClose={() => window.history.back()}
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
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Информация о заказе'
                  onClose={() => navigate('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
