// Импортируем необходимые типы и компоненты.
import React, { FC } from 'react';
import { OrderStatusProps } from './type'; // Типы для пропсов компонента.
import { OrderStatusUI } from '@ui'; // UI-компонент для отображения статуса заказа.

const statusText: { [key: string]: string } = {
  pending: 'Готовится', // Текст для статуса "pending".
  done: 'Выполнен', // Текст для статуса "done".
  created: 'Создан' // Текст для статуса "created".
};

// Основной компонент для отображения статуса заказа.
export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = ''; // Переменная для хранения стиля текста в зависимости от статуса.

  // Устанавливаем стиль в зависимости от статуса.
  switch (status) {
    case 'pending': // Статус "Готовится".
      textStyle = '#E52B1A'; // Красный цвет для статуса "Готовится".
      break;
    case 'done': // Статус "Выполнен".
      textStyle = '#00CCCC'; // Голубой цвет для статуса "Выполнен".
      break;
    default: // Статус по умолчанию (например, "Создан").
      textStyle = '#F2F2F3'; // Светлый цвет для статуса "Создан".
  }

  // Рендерим UI-компонент с переданным текстом и стилем.
  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
