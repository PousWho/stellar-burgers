// Импорты компонентов и утилит
import { Preloader } from '@ui'; // Прелоадер для отображения загрузки
import { FeedUI } from '@ui-pages'; // UI-компонент ленты заказов
import { TOrder } from '@utils-types'; // Типизация заказов
import { FC, useEffect, useCallback } from 'react'; // React хуки и типизация компонента
import { useDispatch, useSelector } from '../../services/store'; // Хуки для работы с Redux
import { getFeedThunk, selectOrders } from '@slices'; // Асинхронное действие и селектор заказов

/**
 * Компонент для отображения ленты заказов.
 */
export const Feed: FC = () => {
  const dispatch = useDispatch(); // Хук для вызова экшенов Redux
  const orders: TOrder[] = useSelector(selectOrders); // Получение списка заказов из Redux

  /**
   * Мемоизированная функция для получения заказов.
   * Предотвращает создание новой функции при каждом рендере.
   */
  const handleGetFeeds = useCallback(() => {
    dispatch(getFeedThunk()); // Запрос заказов через Redux
  }, [dispatch]);

  // Загружаем заказы при первом монтировании компонента
  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  // Если заказов нет, отображаем прелоадер
  return orders.length ? (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
  ) : (
    <Preloader />
  );
};
