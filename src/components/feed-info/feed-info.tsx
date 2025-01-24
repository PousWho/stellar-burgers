// Импорт типа FC (Functional Component) для определения функционального компонента.
import { FC } from 'react';

// Импорт типа заказа.
import { TOrder } from '@utils-types';

// Импорт UI-компонента для отображения информации о ленте заказов.
import { FeedInfoUI } from '@ui';

// Импорт хука для получения данных из Redux-хранилища.
import { useSelector } from '../../services/store';

// Импорт селектора для получения состояния ленты заказов.
import { getFeedStateSelector } from '@slices';

// Вспомогательная функция для фильтрации и получения номеров заказов по их статусу.
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status) // Фильтрация заказов по статусу.
    .map((item) => item.number) // Извлечение номера заказа.
    .slice(0, 20); // Ограничение до 20 элементов.

// Функциональный компонент для отображения информации о ленте заказов.
export const FeedInfo: FC = () => {
  // Получение состояния ленты заказов из хранилища.
  const ordersState = useSelector(getFeedStateSelector);

  // Извлечение списка заказов из состояния.
  const orders: TOrder[] = ordersState.orders;

  // Извлечение общей информации о ленте (всего заказов и заказов за сегодня).
  const feed = { total: ordersState.total, totalToday: ordersState.totalToday };

  // Получение номеров выполненных заказов.
  const readyOrders = getOrders(orders, 'done');

  // Получение номеров заказов в процессе выполнения.
  const pendingOrders = getOrders(orders, 'pending');

  // Рендер UI-компонента с передачей данных о заказах.
  return (
    <FeedInfoUI
      readyOrders={readyOrders} // Список выполненных заказов.
      pendingOrders={pendingOrders} // Список заказов в процессе выполнения.
      feed={feed} // Общая информация о ленте.
    />
  );
};
