import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';

import { logoutUser } from '../../services/slices/profileSlice';
import { useAppDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
