import { FC, memo, useMemo } from 'react'; // Импортируем memo для оптимизации и useMemo для кэширования вычислений.
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  // Мемоизируем сортировку, чтобы не пересчитывать её при каждом ререндере.
  const orderByDate = useMemo(
    () =>
      orders
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [orders] // Пересчитываем только если `orders` изменился.
  );

  // Передаём отсортированные заказы в UI-компонент.
  return <OrdersListUI orderByDate={orderByDate} />;
});
