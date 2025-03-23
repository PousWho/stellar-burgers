// Импортируем необходимые типы и хуки.
import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Типы для пропсов компонента OrderCard.
import { OrderCardProps } from './type';
// Тип для ингредиентов.
import { TIngredient } from '@utils-types';
// UI-компонент для отображения карточки заказа.
import { OrderCardUI } from '../ui/order-card';

// Хук для доступа к состоянию Redux.
import { useSelector } from '../../services/store';
// Селектор для получения списка ингредиентов.
import { selectIngredientList } from '@slices';

// Максимальное количество ингредиентов для отображения в карточке заказа.
const MAX_ITEMS = 6;

// Основной компонент для отображения карточки заказа.
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // Получение текущего пути из URL для работы с модальными окнами.
  const location = useLocation();

  // Получение списка всех ингредиентов из состояния Redux.
  const ingredients = useSelector(selectIngredientList);

  // Мемоизированный объект с информацией о заказе.
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null; // Если ингредиенты ещё не загружены, ничего не рендерим.

    // Получаем массив ингредиентов для текущего заказа.
    const ingredientsInfo = order.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((ingredient): ingredient is TIngredient => Boolean(ingredient)); // Убираем `undefined`

    // Рассчитываем общую стоимость заказа.
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ограничиваем количество ингредиентов для отображения.
    const ingredientsShown = ingredientsInfo.slice(0, MAX_ITEMS);

    // Рассчитываем, сколько ингредиентов осталось.
    const remains = Math.max(ingredientsInfo.length - MAX_ITEMS, 0);

    return {
      ...order,
      ingredientsInfo, // Полный список ингредиентов заказа.
      ingredientsShown, // Ограниченный список для отображения.
      remains, // Количество скрытых ингредиентов.
      total, // Общая стоимость заказа.
      date: new Date(order.createdAt) // Дата заказа.
    };
  }, [order, ingredients]);

  // Если информация о заказе не найдена, не рендерим компонент.
  if (!orderInfo) return null;

  // Рендер UI-компонента карточки заказа с переданными пропсами.
  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_ITEMS}
      locationState={{ background: location }}
    />
  );
});
