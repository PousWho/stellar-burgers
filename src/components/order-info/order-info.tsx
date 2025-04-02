import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getOrderThunk, selectOrder, selectIngredientList } from '@slices';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const orderNumber = Number(useParams().number);

  useEffect(() => {
    if (!isNaN(orderNumber)) {
      dispatch(getOrderThunk(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderData = useSelector(selectOrder);
  const ingredients = useSelector(selectIngredientList);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    // Создаём мапу для быстрого поиска ингредиентов
    const ingredientsMap = new Map(ingredients.map((ing) => [ing._id, ing]));

    // Подсчитываем количество каждого ингредиента
    const ingredientsInfo = orderData.ingredients.reduce<
      Record<string, TIngredient & { count: number }>
    >((acc, id) => {
      const ingredient = ingredientsMap.get(id);
      if (ingredient) {
        acc[id] = acc[id] || { ...ingredient, count: 0 };
        acc[id].count++;
      }
      return acc;
    }, {});

    // Подсчет общей стоимости заказа
    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  return orderInfo ? <OrderInfoUI orderInfo={orderInfo} /> : <Preloader />;
};
