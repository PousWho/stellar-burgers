// Импорт хуков и компонентов
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages'; // UI-компонент для сброса пароля
import { useSelector, useDispatch } from '../../services/store'; // Redux-хуки
// Импорт экшенов и селекторов для работы со сбросом пароля
import {
  resetPasswordThunk,
  getUserErrorSelector,
  clearUserError
} from '@slices';

// Определение функционального компонента ResetPassword
export const ResetPassword: FC = () => {
  const navigate = useNavigate(); // Навигация
  const dispatch = useDispatch(); // Диспетчер Redux

  // Локальные состояния для управления полями формы
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const error = useSelector(getUserErrorSelector) as string; // Получение ошибки из состояния

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращение перезагрузки страницы
    dispatch(resetPasswordThunk({ password, token })).then((data) => {
      if (data.payload) {
        // Если сброс успешен
        localStorage.removeItem('resetPassword'); // Удаление маркера сброса пароля
        navigate('/login'); // Переход на страницу входа
      }
    });
  };

  // Очистка ошибки при монтировании компонента
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  // Проверка наличия маркера сброса пароля в локальном хранилище
  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true }); // Перенаправление на страницу восстановления пароля
    }
  }, [navigate]);

  // Рендер UI-компонента с передачей данных и обработчиков в пропсы
  return (
    <ResetPasswordUI
      errorText={error} // Текст ошибки
      password={password} // Текущий пароль
      token={token} // Текущий токен
      setPassword={setPassword} // Обработчик изменения пароля
      setToken={setToken} // Обработчик изменения токена
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
