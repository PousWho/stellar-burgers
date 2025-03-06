import { FC, useState, SyntheticEvent, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUserError,
  forgotPasswordThunk,
  clearError
} from '@slices';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const error = useSelector(selectUserError) as string;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Очистка ошибки при монтировании
  useEffect(() => {
    dispatch(clearError());
    localStorage.removeItem('resetPassword'); // Убираем флаг, если он был
  }, [dispatch]);

  // Обработчик формы, мемоизированный для оптимизации
  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      const result = await dispatch(forgotPasswordThunk({ email }));

      if (forgotPasswordThunk.fulfilled.match(result)) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      }
    },
    [dispatch, email, navigate]
  );

  return (
    <ForgotPasswordUI
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      errorText={error}
    />
  );
};
