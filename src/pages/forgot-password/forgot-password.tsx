// Импорт React и необходимых хуков
import { FC, useState, SyntheticEvent, useEffect } from 'react';

// Импорт хука навигации из React Router
import { useNavigate } from 'react-router-dom';

// Импорт UI-компонента страницы
import { ForgotPasswordUI } from '@ui-pages';

// Импорт хуков и экшенов Redux
import { useSelector, useDispatch } from '../../services/store';
import {
  forgotPasswordThunk, // Асинхронный экшен для восстановления пароля
  getUserErrorSelector, // Селектор для получения ошибки пользователя
  clearUserError // Экшен для очистки ошибки
} from '@slices';

// Определение функционального компонента ForgotPassword
export const ForgotPassword: FC = () => {
  // Локальное состояние для email
  const [email, setEmail] = useState('');

  // Получение ошибки из состояния через селектор
  const error = useSelector(getUserErrorSelector) as string;

  // Хуки для навигации и dispatch Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Хук эффекта: очищаем ошибку при монтировании компонента
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]); // Добавили зависимость для корректной работы

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Диспатчим асинхронный экшен с email
    dispatch(forgotPasswordThunk({ email })).then((data) => {
      // Если запрос успешен, перенаправляем пользователя на страницу сброса пароля
      if (data.payload) {
        localStorage.setItem('resetPassword', 'true'); // Устанавливаем флаг в localStorage
        navigate('/reset-password', { replace: true }); // Навигация на страницу сброса
      }
    });
  };

  // Рендер UI-компонента с передачей необходимых пропсов
  return (
    <ForgotPasswordUI
      errorText={error} // Текст ошибки для отображения
      email={email} // Текущее значение email
      setEmail={setEmail} // Функция для обновления email
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
