// Импорт необходимых модулей и компонентов
import { ProfileOrdersUI } from '@ui-pages'; // UI-компонент для заказов в профиле
import { TOrder } from '@utils-types'; // Тип заказов
import { FC, useEffect, useMemo } from 'react'; // Хуки React и тип компонента
import { useSelector, useDispatch } from '../../services/store'; // Хуки Redux
import { selectOrders, getOrdersThunk } from '@slices'; // Селектор и асинхронный экшен для заказов

/**
 * Компонент для отображения заказов пользователя в профиле.
 */
export const ProfileOrders: FC = () => {
  const dispatch = useDispatch(); // Инициализация dispatch для вызова Redux экшенов
  const orders: TOrder[] = useSelector(selectOrders); // Получение заказов из Redux

  /**
   * Загружаем заказы при монтировании, если их ещё нет.
   */
  useEffect(() => {
    if (!orders.length) dispatch(getOrdersThunk()); // Делаем запрос заказов, если список пуст
  }, [dispatch, orders.length]);

  /**
   * Мемоизация списка заказов, чтобы избежать лишних ререндеров при неизменных данных.
   */
  const memoizedOrders = useMemo(() => orders, [orders]);

  return <ProfileOrdersUI orders={memoizedOrders} />; // Рендеринг UI-компонента с заказами
};
