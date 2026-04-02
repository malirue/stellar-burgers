import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from 'src/services/store';

// export const ProtectedRoute = ({
//   children
// }: {
//   children?: React.ReactNode;
// }) => {
//   // Получаем данные пользователя из хранилища
//   const { user, isInit } = useSelector((state: RootState) => state.user);

//   // Пока идёт проверка авторизации — показываем лоадер
//   if (!isInit) {
//     return <div>Загрузка авторизации...</div>;
//   }

//   // Если пользователь не авторизован — перенаправляем на /login
//   if (!user) {
//     return <Navigate to='/login' replace />;
//   }

//   // Если авторизован — отображаем запрошенный контент
//   return children ? <>{children}</> : <Outlet />;
// };

export const ProtectedRoute = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  // Временная заглушка: считаем, что пользователь всегда авторизован
  // const isAuthenticated = true; // В будущем заменим на проверку из стора

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
