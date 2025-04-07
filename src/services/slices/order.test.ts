import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { getOrderThunk } from './orderSlice';
import { expect, test, describe, beforeEach } from '@jest/globals';

const setupStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

describe('Тесты orderReducer', () => {
  let store = setupStore();

  beforeEach(() => {
    store = setupStore();
  });

  test('Начальное состояние должно быть корректным', () => {
    const state = store.getState().order;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    // Начальное состояние order – null, а не undefined
    expect(state.order).toBeNull();
  });

  describe('Обработка экшенов getOrderThunk', () => {
    test('pending — ожидание получения заказа', () => {
      store.dispatch({ type: getOrderThunk.pending.type });
      const { isLoading, error } = store.getState().order;
      expect(isLoading).toBe(true);
      expect(error).toBeNull();
    });

    test('rejected — ошибка при получении заказа', () => {
      const mockedError = 'Сервер не отвечает';
      store.dispatch({
        type: getOrderThunk.rejected.type,
        payload: mockedError
      });
      const { isLoading, error } = store.getState().order;
      expect(isLoading).toBe(false);
      expect(error).toBe(mockedError);
    });

    test('fulfilled — успешное получение заказа', () => {
      const mockedOrder = {
        _id: '1',
        name: 'Бургер Кометы',
        number: 12345,
        status: 'done',
        ingredients: ['id1', 'id2'],
        owner: 'user123',
        createdAt: '2025-04-05T12:11:36.596Z',
        updatedAt: '2025-04-05T12:11:40.231Z'
      };

      store.dispatch({
        type: getOrderThunk.fulfilled.type,
        payload: mockedOrder
      });
      const { isLoading, error, order } = store.getState().order;
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
      expect(order).toEqual(mockedOrder);
    });
  });
});
