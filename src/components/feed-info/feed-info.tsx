// Импорт FC для объявления функционального компонента
import { FC } from 'react';

// Импорт типов и UI-компонента
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';

// Импорт хука и селектора для работы с Redux
import { useSelector } from '../../services/store';
import { getFeedStateSelector } from '@slices';

/**
 * Вспомогательная функция для получения номеров заказов по статусу.
 * @param orders - Список заказов.
 * @param status - Целевой статус ('done' или 'pending').
 * @returns Первые 20 номеров заказов с указанным статусом.
 */
const getOrdersByStatus = (orders: TOrder[], status: string): number[] =>
  orders.filter((order) => order.status === status).map((order) => order.number).slice(0, 20);

/**
 * Компонент для отображения информации о ленте заказов.
 */
export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(getFeedStateSelector); // Получение данных из Redux

  return (
    <FeedInfoUI
      readyOrders={getOrdersByStatus(orders, 'done')} // Выполненные заказы
      pendingOrders={getOrdersByStatus(orders, 'pending')} // В процессе выполнения
      feed={{ total, totalToday }} // Общая информация о заказах
    />
  );
};
