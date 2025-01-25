// Импорт необходимых компонентов, хуков и типов
import { ProfileUI } from '@ui-pages'; // UI-компонент профиля
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store'; // Хуки для работы с Redux
import { getUserSelector, updateUserThunk } from '@slices'; // Селектор и экшен для работы с пользователем
import { TUser } from '@utils-types'; // Тип данных пользователя

// Определение функционального компонента Profile
export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch(); // Инициализация диспетчера Redux
  const user = useSelector(getUserSelector) as TUser; // Получение текущего пользователя из состояния

  // Локальное состояние для значений формы
  const [formValue, setFormValue] = useState({
    name: user.name, // Инициализация имени
    email: user.email, // Инициализация email
    password: '' // Пароль пустой по умолчанию
  });

  // Синхронизация локального состояния с данными пользователя при изменении `user`
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '', // Обновление имени
      email: user?.email || '' // Обновление email
    }));
  }, [user]); // Зависимость от `user`

  // Определение, изменена ли форма
  const isFormChanged =
    formValue.name !== user?.name || // Сравнение имени
    formValue.email !== user?.email || // Сравнение email
    !!formValue.password; // Проверка, заполнен ли пароль

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращение перезагрузки страницы
    dispatch(updateUserThunk(formValue)); // Диспатч экшена обновления пользователя
    setFormValue({
      ...user, // Сброс значений формы
      password: '' // Пароль остается пустым
    });
  };

  // Обработчик отмены изменений
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращение действия по умолчанию
    setFormValue({
      name: user.name, // Сброс имени
      email: user.email, // Сброс email
      password: '' // Сброс пароля
    });
  };

  // Обработчик изменения значений полей ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value // Обновление значения по имени поля
    }));
  };

  // Рендер UI-компонента профиля с передачей пропсов
  return (
    <ProfileUI
      formValue={formValue} // Значения формы
      isFormChanged={isFormChanged} // Флаг изменения формы
      handleCancel={handleCancel} // Обработчик отмены
      handleSubmit={handleSubmit} // Обработчик отправки
      handleInputChange={handleInputChange} // Обработчик изменения полей ввода
    />
  );
};
