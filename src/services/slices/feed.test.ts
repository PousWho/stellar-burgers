import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { getOrderThunk } from './orderSlice';
import { expect, test, describe, beforeEach } from '@jest/globals';

const setupStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

let store: ReturnType<typeof setupStore>;

beforeEach(() => {
  store = setupStore();
});

describe('Тесты orderReducer', () => {
  test('pending — ожидание получения заказа', () => {
    store.dispatch({ type: getOrderThunk.pending.type });
    const state = store.getState();
    expect(state.order.isLoading).toBe(true);
    expect(state.order.error).toBeNull();
  });

  test('rejected — ошибка при получении заказа', () => {
    const mockedError = 'Сервер не отвечает';
    store.dispatch({
      type: getOrderThunk.rejected.type,
      payload: mockedError
    });
    const state = store.getState();
    expect(state.order.isLoading).toBe(false);
    expect(state.order.error).toBe(mockedError);
  });

  test('fulfilled — успешное получение заказа', () => {
    const mockedOrder = {
      _id: '660e81bb97ede0001d0643eb',
      name: 'Бургер Кометы',
      number: 12345,
      status: 'done',
      ingredients: ['id1', 'id2'],
      owner: 'user123',
      createdAt: '2024-04-04T10:32:27.595Z',
      updatedAt: '2024-04-04T10:32:28.181Z'
    };

    store.dispatch({
      type: getOrderThunk.fulfilled.type,
      payload: mockedOrder
    });
    const state = store.getState();
    expect(state.order.isLoading).toBe(false);
    expect(state.order.error).toBeNull();
    expect(state.order.order).toEqual(mockedOrder);
  });
});
