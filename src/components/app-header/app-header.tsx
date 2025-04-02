// Импорт хука useSelector для получения данных из хранилища Redux.
import { useSelector } from '../../services/store';

// Импорт UI-компонента заголовка приложения.
import { AppHeaderUI } from '@ui';

// Импорт типизации FC (Functional Component) из React.
import { FC } from 'react';

// Импорт селектора для получения данных пользователя из хранилища.
import { selectUser } from '@slices';

// Компонент заголовка приложения.
export const AppHeader: FC = () => {
  // Получение имени пользователя из хранилища через селектор.
  const userName = useSelector(selectUser)?.name;

  // Возврат UI-компонента с передачей имени пользователя в пропсы.
  return <AppHeaderUI userName={userName} />;
};
