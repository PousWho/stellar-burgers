// Импортируем необходимые типы и хуки.
import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader'; // Компонент для отображения загрузки.
import { OrderInfoUI } from '../ui/order-info'; // UI-компонент для отображения информации о заказе.
import { TIngredient } from '@utils-types'; // Тип для ингредиентов.
import { useParams } from 'react-router-dom'; // Хук для получения параметров URL.
import { useDispatch, useSelector } from '../../services/store'; // Хуки для работы с Redux.
import { getOrderThunk, getOrderSelector, getIngredientsSelector } from '@slices'; // Диспатчи и селекторы для получения данных о заказе и ингредиентах.

// Основной компонент для отображения информации о заказе.
export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  // Получаем номер заказа из параметров URL.
  const orderNubmer = Number(useParams().number);

  // Запускаем запрос для получения информации о заказе при монтировании компонента.
  useEffect(() => {
    dispatch(getOrderThunk(orderNubmer)); // Диспатчим экшен для получения заказа.
  }, [dispatch, orderNubmer]);

  // Получаем данные о заказе из Redux.
  const orderData = useSelector(getOrderSelector).order;

  // Получаем список ингредиентов из Redux.
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  // Мемоизация данных о заказе и ингредиентах для предотвращения лишних пересчетов.
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null; // Если данных о заказе или ингредиентах нет, возвращаем null.

    const date = new Date(orderData.createdAt); // Преобразуем дату создания заказа.

    // Тип для хранения ингредиентов с количеством.
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Формируем объект с ингредиентами и их количеством.
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        // Если ингредиент еще не добавлен, добавляем его с количеством 1.
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          // Если ингредиент уже есть, увеличиваем его количество.
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    // Рассчитываем общую стоимость заказа, умножая цену каждого ингредиента на его количество.
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возвращаем полную информацию о заказе.
    return {
      ...orderData,
      ingredientsInfo, // Информация о ингредиентах с количеством.
      date, // Дата заказа.
      total // Общая стоимость заказа.
    };
  }, [orderData, ingredients]); // Пересчитываем, если изменились orderData или ingredients.

  // Если информация о заказе еще не получена, показываем прелоадер.
  if (!orderInfo) {
    return <Preloader />;
  }

  // Рендерим UI-компонент с переданными данными о заказе.
  return <OrderInfoUI orderInfo={orderInfo} />;
};
