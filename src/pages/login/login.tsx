import { FC, SyntheticEvent, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUserThunk, clearError } from '@slices';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.user.error);

  // Локальное состояние для email и пароля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Очистка ошибки при монтировании
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Обработчик отправки формы (мемоизирован)
  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      const result = await dispatch(loginUserThunk({ email, password }));

      if (loginUserThunk.fulfilled.match(result)) {
        setEmail('');
        setPassword('');
        navigate('/', { replace: true });
      }
    },
    [dispatch, email, password, navigate]
  );

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={error?.toString() || ''}
    />
  );
};
