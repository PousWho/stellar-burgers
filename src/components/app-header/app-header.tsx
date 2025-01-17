import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';
import { FC } from 'react';
import { getUserSelector } from '@slices';

export const HeaderApp: FC = () => {
  const userName = useSelector(getUserSelector)?.name;
  return <AppHeaderUI userName={userName} />;
};
