import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthorized } from '@slices';

type ProtectedRouteProps = {
  forAuthorized: boolean; // Требуется ли авторизация для доступа к маршруту.
};

export const ProtectedRoute = ({ forAuthorized }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthorized = useSelector(selectIsAuthorized);
  const from = location.state?.from ?? '/';

  if (isAuthorized && !forAuthorized) return <Navigate to={from} />; // Если залогинен, но маршрут не для авторизованных – редирект.
  if (!isAuthorized && forAuthorized)
    return <Navigate to='/login' state={{ from: location }} />; // Если не залогинен, но маршрут для авторизованных – редирект на логин.

  return <Outlet />; // В остальных случаях просто рендерим вложенные роуты.
};
