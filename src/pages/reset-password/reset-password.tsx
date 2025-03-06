import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import {
  resetPasswordThunk,
  selectUserError,
  clearError
} from '@slices';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(selectUserError) as string;

  // Проверяем наличие ключа в localStorage
  useEffect(() => {
    const hasResetFlag = localStorage.getItem('resetPassword'); // Получаем значение
    if (!hasResetFlag) {
      navigate('/forgot-password', { replace: true }); // Если нет флага, редиректим
    }
    dispatch(clearError()); // Очищаем ошибки при монтировании
  }, [navigate, dispatch]);

  // Обработчик формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await dispatch(resetPasswordThunk({ password, token }));

      if (resetPasswordThunk.fulfilled.match(response)) {
        localStorage.removeItem('resetPassword'); // Удаляем маркер
        navigate('/login'); // Редирект на логин
      }
    } catch (err) {
      console.error('Ошибка при сбросе пароля:', err);
    }
  };

  return (
    <ResetPasswordUI
      password={password}
      token={token}
      errorText={error}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
