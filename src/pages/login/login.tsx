// Импорт необходимых React-хуков и типов
import { FC, SyntheticEvent, useState, useEffect } from 'react';

// Импорт UI-компонента страницы логина
import { LoginUI } from '@ui-pages';

// Импорт хука навигации из React Router
import { useNavigate } from 'react-router-dom';

// Импорт хуков и экшенов Redux
import { useDispatch, useSelector } from '../../services/store';
import { loginUserThunk, clearUserError } from '@slices';

// Определение функционального компонента Login
export const Login: FC = () => {
  const dispatch = useDispatch(); // Инициализация диспетчера Redux
  const navigate = useNavigate(); // Инициализация навигации React Router
  const error = useSelector((state) => state.user.error); // Получение ошибки из состояния пользователя

  // Локальное состояние для email и пароля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Хук эффекта: очищаем ошибку при монтировании компонента
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]); // Добавили зависимость для корректной работы

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    // Диспатчим асинхронный экшен с email и паролем
    dispatch(loginUserThunk({ email, password })).then((data) => {
      // Если логин успешен, перенаправляем пользователя на главную страницу
      if (data.payload) {
        navigate('/', { replace: true });
      }
    });
  };

  // Рендер UI-компонента с передачей необходимых пропсов
  return (
    <LoginUI
      errorText={error?.toString()} // Преобразование ошибки в строку для отображения
      email={email} // Текущее значение email
      setEmail={setEmail} // Функция для обновления email
      password={password} // Текущее значение пароля
      setPassword={setPassword} // Функция для обновления пароля
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
