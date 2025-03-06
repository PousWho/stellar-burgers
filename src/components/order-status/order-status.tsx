import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

// Объект для соответствия статусов их текстовым представлениям.
const statusText: Record<string, string> = {
  pending: 'Готовится', // Заказ в процессе приготовления.
  done: 'Выполнен', // Заказ завершён.
  created: 'Создан' // Заказ только что создан.
};

// Объект для соответствия статусов их цветовым стилям.
const statusColors: Record<string, string> = {
  pending: '#E52B1A', // Красный цвет — заказ готовится.
  done: '#00CCCC', // Голубой цвет — заказ выполнен.
  created: '#F2F2F3' // Светло-серый — заказ создан.
};

// Компонент для отображения статуса заказа.
export const OrderStatus: FC<OrderStatusProps> = ({ status }) => (
  <OrderStatusUI
    textStyle={statusColors[status] ?? '#F2F2F3'} // Если статус неизвестен, используем цвет по умолчанию.
    text={statusText[status] ?? 'Неизвестно'} // Если статус неизвестен, показываем дефолтный текст.
  />
);
