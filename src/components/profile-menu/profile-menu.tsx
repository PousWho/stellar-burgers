// Импортируем необходимые типы и компоненты.
import { FC } from 'react'; // Функциональный компонент.
import { useLocation } from 'react-router-dom'; // Хук для получения информации о текущем пути.
import { ProfileMenuUI } from '@ui'; // UI-компонент для отображения меню профиля.
import { useDispatch } from '../../services/store'; // Хук для доступа к dispatch.
import { logoutUserThunk } from '@slices'; // Действие для выхода пользователя.

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch(); // Получаем dispatch для отправки действий.
  const { pathname } = useLocation(); // Получаем текущий путь для использования в UI.

  // Функция обработки выхода пользователя.
  const handleLogout = () => {
    dispatch(logoutUserThunk()); // Отправляем действие для выхода.
  };

  // Рендерим UI-компонент меню профиля, передавая текущий путь и функцию выхода.
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
