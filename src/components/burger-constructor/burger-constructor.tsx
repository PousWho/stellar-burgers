// Импорт хука для управления навигацией.
import { useNavigate } from 'react-router-dom';

// Импорт UI-компонента для конструктора бургера.
import { BurgerConstructorUI } from '@ui';

// Импорты хуков и утилит из Redux-хранилища.
import { useDispatch, useSelector } from '../../services/store';

// Импорты React-хуков и типизации FC (Functional Component).
import { FC, useMemo } from 'react';

// Импорт типа для ингредиента конструктора.
import { TConstructorIngredient } from '@utils-types';

// Импорты экшенов и селекторов Redux.
import {
  setOrderRequest,
  sendOrderThunk,
  setNullOrderModalData,
  isAuthorizedSelector,
  getConstructorSelector
} from '@slices';

// Компонент конструктора бургера.
export const BurgerConstructor: FC = () => {
  // Хук для навигации по маршрутам.
  const navigate = useNavigate();

  // Хук для отправки экшенов в Redux.
  const dispatch = useDispatch();

  // Получение данных конструктора и статусов из хранилища через селектор.
  const { constructorItems, orderRequest, orderModalData } = useSelector(
    getConstructorSelector
  );
  const isAuthorized = useSelector(isAuthorizedSelector);

  // Расчет итоговой стоимости заказа с использованием useMemo для оптимизации.
  const price = useMemo(() => {
    // Цена булки (удваивается, так как она используется сверху и снизу).
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    // Сумма цен всех ингредиентов.
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (total, item: TConstructorIngredient) => total + item.price,
      0
    );

    // Общая стоимость.
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  // Обработчик нажатия на кнопку заказа.
  const handleOrderClick = () => {
    // Если булка не выбрана, ничего не делаем.
    if (!constructorItems.bun) return;

    // Если пользователь не авторизован, перенаправляем на страницу логина.
    if (!isAuthorized) {
      navigate('/login');
    } else {
      // Устанавливаем статус запроса заказа.
      dispatch(setOrderRequest(true));

      // Получаем ID булки и ингредиентов.
      const bunId = constructorItems.bun._id;
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );

      // Отправляем заказ, передавая ID булки дважды (в начале и в конце).
      dispatch(sendOrderThunk([bunId, ...ingredientsIds, bunId]));
    }
  };

  // Обработчик закрытия модального окна заказа.
  const handleCloseOrderModal = () => {
    // Сбрасываем статус запроса заказа.
    dispatch(setOrderRequest(false));

    // Очищаем данные модального окна.
    dispatch(setNullOrderModalData());
  };

  // Рендер UI-компонента с передачей необходимых данных и обработчиков.
  return (
    <BurgerConstructorUI
      price={price} // Итоговая стоимость заказа.
      orderRequest={orderRequest} // Статус запроса заказа.
      constructorItems={constructorItems} // Ингредиенты конструктора.
      orderModalData={orderModalData} // Данные для модального окна заказа.
      onOrderClick={handleOrderClick} // Обработчик нажатия на кнопку заказа.
      closeOrderModal={handleCloseOrderModal} // Обработчик закрытия модального окна.
    />
  );
};
