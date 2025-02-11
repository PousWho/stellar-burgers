import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { isAuthorizedSelector } from '@slices';

type ProtectedRouteProps = {
  forAuthorized: boolean; // Требуется ли авторизация для доступа к маршруту.
};

export const ProtectedRoute = ({
  forAuthorized = false
}: ProtectedRouteProps) => {
  const location = useLocation(); // Получаем текущий маршрут.
  const isAuthorized = useSelector(isAuthorizedSelector); // Проверяем авторизацию пользователя.
  const from = location.state?.from ?? '/'; // Запоминаем маршрут, с которого был редирект.

  // Если пользователь авторизован и маршрут не для авторизованных — редиректим назад.
  if (isAuthorized) return forAuthorized ? <Outlet /> : <Navigate to={from} />;

  // Если маршрут для авторизованных, но пользователь не вошел — редиректим на логин.
  return forAuthorized ? (
    <Navigate to='/login' state={{ from: location }} />
  ) : (
    <Outlet />
  );
};
