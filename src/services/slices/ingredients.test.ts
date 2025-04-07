import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { fetchIngredientsAsync } from './ingredientsSlice';
import { expect, test, describe, beforeEach } from '@jest/globals';

const setupStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer
    }
  });

describe('Тесты экшенов ингредиентов ingredientsReducer', () => {
  let store = setupStore();

  beforeEach(() => {
    store = setupStore();
  });

  test('Ожидание ответа после запроса ингредиентов (pending)', () => {
    store.dispatch({ type: fetchIngredientsAsync.pending.type });
    const state = store.getState().ingredients;
    expect(state.isLoading).toBeTruthy();
    expect(state.error).toBeNull();
  });

  test('Ошибка при запросе ингредиентов (rejected)', () => {
    const mockedError = 'mocked error';
    // Передаём ошибку через payload, как это ожидает редьюсер
    store.dispatch({
      type: fetchIngredientsAsync.rejected.type,
      payload: mockedError
    });
    const state = store.getState().ingredients;
    expect(state.isLoading).toBeFalsy();
    expect(state.error).toBe(mockedError);
  });

  test('Успешное получение ингредиентов (fulfilled)', () => {
    const mockedPayload = [
      {
        _id: '1',
        name: 'name1',
        type: 'bun',
        proteins: 75,
        fat: 20,
        carbohydrates: 60,
        calories: 500,
        price: 1000,
        image: 'https://code.s3.yandex.net/react/code/bun-04.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-04-large.png'
      }
    ];
    store.dispatch({
      type: fetchIngredientsAsync.fulfilled.type,
      payload: mockedPayload
    });
    const state = store.getState().ingredients;
    expect(state.isLoading).toBeFalsy();
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockedPayload);
  });
});
