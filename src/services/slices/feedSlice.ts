import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

// Интерфейс состояния фида
export interface feedState {
  isLoading: boolean; // Состояние загрузки
  orders: TOrder[]; // Список заказов
  total: number; // Общее количество заказов
  totalToday: number; // Количество заказов за сегодня
  error: string | null; // Сообщение об ошибке
}

// Начальное состояние
const initialState: feedState = {
  isLoading: false, // Изначально загрузка не выполняется
  orders: [], // Список заказов пуст
  total: 0, // Нет данных о количестве заказов
  totalToday: 0, // Нет данных о заказах за сегодня
  error: null // Ошибок нет
};

// Асинхронное действие для получения общего фида заказов
export const getFeedThunk = createAsyncThunk(
  'feed/getFeed', // Имя действия
  getFeedsApi // Функция API для получения данных
);

// Асинхронное действие для получения заказов пользователя
export const getOrdersThunk = createAsyncThunk(
  'feed/getProfileFeed', // Имя действия
  getOrdersApi // Функция API для получения данных
);

// Создание слайса
const feedSlice = createSlice({
  name: 'feed', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Нет обычных редьюсеров
  selectors: {
    // Селектор для получения полного состояния
    getFeedStateSelector: (state) => state,
    // Селектор для получения списка заказов
    getOrdersSelector: (state) => state.orders
  },
  extraReducers: (builder) => {
    // Обработка состояния для getFeedThunk
    builder
      .addCase(getFeedThunk.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.error = null; // Сбрасываем ошибки
      })
      .addCase(getFeedThunk.rejected, (state, { error }) => {
        state.isLoading = false; // Сбрасываем флаг загрузки
        state.error = error.message || 'Unknown error'; // Сохраняем ошибку
      })
      .addCase(getFeedThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false; // Завершаем загрузку
        state.error = null; // Сбрасываем ошибки
        state.orders = payload.orders; // Сохраняем заказы
        state.total = payload.total; // Сохраняем общее количество
        state.totalToday = payload.totalToday; // Сохраняем количество за сегодня
      });

    // Обработка состояния для getOrdersThunk
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.error = null; // Сбрасываем ошибки
      })
      .addCase(getOrdersThunk.rejected, (state, { error }) => {
        state.isLoading = false; // Сбрасываем флаг загрузки
        state.error = error.message || 'Unknown error'; // Сохраняем ошибку
      })
      .addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false; // Завершаем загрузку
        state.error = null; // Сбрасываем ошибки
        state.orders = payload; // Сохраняем заказы пользователя
      });
  }
});

// Экспорт начального состояния
export { initialState as feedInitialState };

// Экспорт селекторов
export const { getFeedStateSelector, getOrdersSelector } = feedSlice.selectors;

// Экспорт редьюсера
export default feedSlice.reducer;
