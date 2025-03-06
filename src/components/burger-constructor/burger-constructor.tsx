import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useMemo } from 'react';
import {
  setOrderLoading,
  submitOrderAsync,
  clearOrderModalData,
  selectIsAuthorized,
  selectConstructorState
} from '@slices';

// Компонент конструктора бургера.
export const BurgerConstructor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Данные конструктора и статус авторизации.
  const { constructorItems, orderRequest, orderModalData } = useSelector(
    selectConstructorState
  );
  const isAuthorized = useSelector(selectIsAuthorized);

  // Расчет итоговой стоимости заказа.
  const price = useMemo(
    () =>
      (constructorItems.bun?.price ?? 0) * 2 +
      constructorItems.ingredients.reduce((sum, { price }) => sum + price, 0),
    [constructorItems]
  );

  // Обработчик оформления заказа.
  const handleOrder = () => {
    if (!constructorItems.bun) return; // Без булки нельзя оформить заказ.
    if (!isAuthorized) return navigate('/login'); // Если не авторизован — перенаправление на логин.

    dispatch(setOrderLoading(true));
    dispatch(
      submitOrderAsync([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(({ _id }) => _id),
        constructorItems.bun._id
      ])
    );
  };

  // Обработчик закрытия модального окна заказа.
  const handleCloseModal = () => {
    dispatch(setOrderLoading(false));
    dispatch(clearOrderModalData());
  };

  // Рендер UI-компонента с передачей данных и обработчиков.
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrder}
      closeOrderModal={handleCloseModal}
    />
  );
};
