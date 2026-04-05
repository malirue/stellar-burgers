import { TRegisterData } from '@api';
import { updateUser, useAppDispatch, useAppSelector } from '@services';
import { ProfileUI } from '@ui-pages';

import { FC, SyntheticEvent, useEffect, useState } from 'react';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user)!;
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user.name,
      email: user.email
    }));
  }, [user]);

  const isFormChanged =
    (user && formValue.name !== user.name) ||
    (user && formValue.email !== user.email) ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) return;

    const updateData: Partial<TRegisterData> = {};

    if (user?.name !== formValue.name) {
      updateData.name = formValue.name;
    }
    if (user?.email !== formValue.email) {
      updateData.email = formValue.email;
    }
    if (formValue.password) {
      updateData.password = formValue.password;
    }

    if (Object.keys(updateData).length > 0) {
      await dispatch(updateUser(updateData));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
