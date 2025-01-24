// Импортируем необходимые типы и хуки.
import { FC, memo, useEffect, useMemo } from 'react';
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
import { getIngredientsSelector } from '@slices';

// Максимальное количество ингредиентов для отображения в карточке заказа.
const maxIngredients = 6;

// Основной компонент для отображения карточки заказа.
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // Получение текущего пути из URL для работы с модальными окнами.
  const location = useLocation();

  // Получение списка всех ингредиентов из состояния Redux.
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  // Используем useMemo для оптимизации вычислений (мемоизация).
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null; // Если ингредиенты пусты, возвращаем null.

    // Формируем массив ингредиентов для текущего заказа.
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        // Ищем ингредиент по ID в списке ингредиентов.
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient]; // Добавляем в массив найденный ингредиент.
        return acc; // Если ингредиент не найден, продолжаем.
      },
      []
    );

    // Рассчитываем общую стоимость заказа.
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ограничиваем количество ингредиентов для отображения.
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Рассчитываем, сколько ингредиентов осталось.
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Формируем объект с информацией о заказе.
    const date = new Date(order.createdAt); // Дата создания заказа.
    return {
      ...order,
      ingredientsInfo, // Все ингредиенты заказа.
      ingredientsToShow, // Ограниченное количество ингредиентов для отображения.
      remains, // Сколько ингредиентов не помещается.
      total, // Общая стоимость заказа.
      date // Дата заказа.
    };
  }, [order, ingredients]); // Пересчитываем, если изменились order или ingredients.

  // Если информация о заказе не найдена, возвращаем null.
  if (!orderInfo) return null;

  // Рендерим UI компонента карточки заказа с переданными пропсами.
  return (
    <OrderCardUI
      orderInfo={orderInfo} // Информация о заказе.
      maxIngredients={maxIngredients} // Максимальное количество ингредиентов для отображения.
      locationState={{ background: location }} // Передаем информацию о текущем пути для работы с модальными окнами.
    />
  );
});
