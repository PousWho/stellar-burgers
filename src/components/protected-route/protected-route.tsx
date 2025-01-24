// Импортируем необходимые компоненты и хуки.
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // Navigate для перенаправлений, Outlet для вложенных маршрутов.
import { useSelector } from '../../services/store'; // Хук для получения состояния из store.
import { isAuthorizedSelector } from '@slices'; // Селектор для получения информации о авторизации пользователя.

type ProtectedRouteProps = {
  forAuthorized: boolean; // Пропс для указания, требуется ли авторизация.
};

export const ProtectedRoute = ({
  forAuthorized = false
}: ProtectedRouteProps) => {
  const location = useLocation(); // Хук для получения текущего маршрута.
  const isAuthorized = useSelector(isAuthorizedSelector); // Проверяем, авторизован ли пользователь.
  const from = location.state?.from || '/'; // Если был редирект с другого маршрута, сохраняем его, иначе возвращаем на главную.

  // Если доступ разрешен только неавторизованным пользователям, но пользователь авторизован, перенаправляем его на предыдущую страницу.
  if (!forAuthorized && isAuthorized) {
    return <Navigate to={from} />; // Редирект на исходный путь.
  }

  // Если доступ разрешен только авторизованным пользователям, но пользователь не авторизован, перенаправляем на страницу логина.
  if (forAuthorized && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} />; // Редирект на страницу логина с сохранением исходного пути.
  }

  // Если все проверки прошли, рендерим вложенные маршруты.
  return <Outlet />;
};
