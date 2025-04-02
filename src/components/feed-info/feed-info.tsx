// Импорт необходимых библиотек и компонентов
import { FC } from 'react'; // Импорт типа для функциональных компонентов
import { TOrder } from '@utils-types'; // Импорт типа заказов
import { FeedInfoUI } from '@ui'; // UI-компонент для отображения информации о фиде
import { useSelector } from '../../services/store'; // Хук для получения данных из Redux
import { selectFeed } from '@slices'; // Селектор состояния фида

/**
 * Функция для получения первых 20 номеров заказов по заданному статусу.
 */
const getFirstTwentyOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status) // Фильтрация заказов по статусу
    .map((order) => order.number) // Извлечение номеров заказов
    .slice(0, 20); // Обрезка массива до 20 элементов

/**
 * Компонент для отображения общей информации о ленте заказов.
 */
export const FeedStats: FC = () => {
  // Получение состояния фида из Redux (список заказов, общее количество и количество за сегодня)
  const { orders, total, totalToday } = useSelector(selectFeed);

  return (
    <FeedInfoUI
      readyOrders={getFirstTwentyOrders(orders, 'done')} // Передача выполненных заказов
      pendingOrders={getFirstTwentyOrders(orders, 'pending')} // Передача заказов в процессе выполнения
      feed={{ total, totalToday }} // Общая статистика заказов
    />
  );
};
