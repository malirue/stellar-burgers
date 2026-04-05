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
import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '../../services/store';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useAppDispatch();

  const isIngredientsLoading = useAppSelector(
    (state: RootState) => state.ingredients.isLoading
  );
  const ingredients = useAppSelector(
    (state: RootState) => state.ingredients.items
  );
  const error = useAppSelector((state: RootState) => state.ingredients.error);

  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading
  } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  console.log('isIngredientsLoading:', isIngredientsLoading);
  console.log('ingredients:', ingredients);
  console.log('error:', error);
  console.log('user:', user);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('isAuthLoading:', isAuthLoading);

  //Загрузка авторизации
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
                  onClose={() => window.history.back()}
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
