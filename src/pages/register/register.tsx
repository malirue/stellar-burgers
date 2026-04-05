import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '../../services/store';
import { registerUser } from '../../services/slices/profileSlice';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useAppSelector((state: RootState) => state.user.error);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    );
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
