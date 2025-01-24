// Импортируем необходимые типы и компоненты.
import { FC, memo } from 'react'; // Импорт функционального компонента и memo для оптимизации ререндеров.
import { OrdersListProps } from './type'; // Типы для пропсов компонента.
import { OrdersListUI } from '@ui'; // UI-компонент для отображения списка заказов.

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  // Создаем новый массив, сортируя заказы по дате в порядке убывания (сначала самые новые).
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Рендерим UI-компонент, передавая отсортированные заказы.
  return <OrdersListUI orderByDate={orderByDate} />;
});
