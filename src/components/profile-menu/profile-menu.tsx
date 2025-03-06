import { FC, memo, useCallback } from 'react'; // Импортируем memo и useCallback для оптимизации.
import { useLocation } from 'react-router-dom';
import { logoutUserThunk } from '@slices';
import { useDispatch } from '../../services/store';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = memo(() => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // Мемоизируем функцию выхода, чтобы она не пересоздавалась при каждом ререндере.
  const handleLogout = useCallback(() => {
    dispatch(logoutUserThunk());
  }, [dispatch]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
});
