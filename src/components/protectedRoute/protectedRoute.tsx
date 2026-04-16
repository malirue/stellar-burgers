import { Navigate, Outlet } from 'react-router-dom';
import { RootState, useSelector } from '@services';

export const ProtectedRoute = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  if (!isAuthenticated) {
    localStorage.setItem('back', location.pathname);
    return <Navigate to='/login' replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
