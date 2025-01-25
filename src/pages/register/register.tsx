// Импорт хуков и компонентов
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages'; // UI-компонент для регистрации
import { useDispatch, useSelector } from '../../services/store'; // Redux-хуки
// Импорт экшенов и селекторов для работы с регистрацией пользователя
import {
  clearUserError,
  registerUserThunk,
  getUserErrorSelector
} from '@slices';

// Определение функционального компонента Register
export const Register: FC = () => {
  const dispatch = useDispatch(); // Инициализация диспетчера Redux
  const error = useSelector(getUserErrorSelector); // Получение ошибки из состояния

  // Локальные состояния для управления полями формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращение перезагрузки страницы
    const name = userName; // Приведение имени пользователя к отдельной переменной
    dispatch(registerUserThunk({ email, name, password })); // Вызов thunk для регистрации пользователя
  };

  // Очистка ошибки при монтировании компонента
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]); // Зависимость - диспетчер Redux

  // Рендер UI-компонента с передачей данных и обработчиков в пропсы
  return (
    <RegisterUI
      errorText={error?.toString()} // Преобразование ошибки в строку
      email={email} // Передача текущего email
      userName={userName} // Передача текущего имени пользователя
      password={password} // Передача текущего пароля
      setEmail={setEmail} // Обработчик изменения email
      setPassword={setPassword} // Обработчик изменения пароля
      setUserName={setUserName} // Обработчик изменения имени пользователя
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
