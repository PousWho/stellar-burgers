// Импорт необходимых компонентов и утилит
import { Preloader } from '@ui'; // Компонент отображения загрузки
import { FeedUI } from '@ui-pages'; // Основной UI-компонент ленты заказов
import { TOrder } from '@utils-types'; // Тип для заказа
import { FC, useEffect } from 'react'; // React-типы и хук эффекта
import { useDispatch, useSelector } from '../../services/store'; // Хуки для работы с Redux
import { getFeedThunk, getOrdersSelector } from '@slices'; // Асинхронный экшен и селектор заказов

// Определение функционального компонента Feed
export const Feed: FC = () => {
  const dispatch = useDispatch(); // Инициализация диспетчера Redux
  const orders: TOrder[] = useSelector(getOrdersSelector); // Получение массива заказов из Redux

  // Функция для запуска получения данных ленты
  const handleGetFeeds = () => {
    dispatch(getFeedThunk()); // Диспатчим асинхронный экшен
  };

  // Хук эффекта: выполняется при монтировании компонента
  useEffect(() => {
    handleGetFeeds(); // Получение данных при первом рендере
  }, [dispatch]); // Зависимость — dispatch (гарантия корректной работы)

  // Если заказы ещё не загружены, показываем прелоадер
  if (!orders.length) {
    return <Preloader />;
  }

  // Отображаем основной UI с заказами и функцией обновления
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
