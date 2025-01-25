// Импорт UI-компонента для отображения заказов
import { ProfileOrdersUI } from '@ui-pages';
// Импорт типа заказа
import { TOrder } from '@utils-types';
// Импорт React-хуков
import { FC, useEffect } from 'react';
// Импорт хуков и экшенов из Redux
import { useSelector, useDispatch } from '../../services/store';
// Импорт селектора и thunk для работы с заказами
import { getOrdersSelector, getOrdersThunk } from '@slices';

// Определение функционального компонента ProfileOrders
export const ProfileOrders: FC = () => {
  const dispatch = useDispatch(); // Инициализация диспетчера Redux
  const orders: TOrder[] = useSelector(getOrdersSelector); // Получение списка заказов из состояния

  // Хук для загрузки заказов при монтировании компонента
  useEffect(() => {
    dispatch(getOrdersThunk()); // Запуск thunk для получения заказов
  }, [dispatch]); // Зависимость - диспетчер Redux

  // Рендер UI-компонента с передачей заказов в пропсы
  return <ProfileOrdersUI orders={orders} />;
};
