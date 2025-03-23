import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearError, registerUserThunk, selectUserError } from '@slices';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);

  // Локальные состояния формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Очистка ошибки при монтировании
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk({ email, name: userName, password }));
  };

  return (
    <RegisterUI
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      errorText={error?.toString()} // Преобразование ошибки в строку
    />
  );
};
