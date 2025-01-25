import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

// Интерфейс состояния заказа
export interface OrderState {
  isLoading: boolean; // Указывает, выполняется ли загрузка
  order: TOrder | null; // Данные заказа (null, если не загружено)
  error: string | null; // Сообщение об ошибке, если есть
}

// Начальное состояние для управления заказами
const initialState: OrderState = {
  isLoading: false, // Загрузка изначально отключена
  order: null, // Данные заказа отсутствуют
  error: null // Ошибок нет
};

// Асинхронное действие для получения данных о заказе по номеру
export const getOrderThunk = createAsyncThunk(
  'feed/getOrder', // Имя действия
  (number: number) => getOrderByNumberApi(number) // Вызов API с передачей номера заказа
);

// Создание слайса для управления состоянием заказа
const orderSlice = createSlice({
  name: 'order', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Редьюсеры отсутствуют, так как используем только асинхронные действия
  selectors: {
    // Селектор для получения состояния заказа
    getOrderSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояния при начале загрузки
      .addCase(getOrderThunk.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.error = null; // Сбрасываем предыдущие ошибки
      })
      // Обработка состояния при ошибке загрузки
      .addCase(getOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false; // Завершаем загрузку
        state.error = error.message as string; // Сохраняем сообщение об ошибке
      })
      // Обработка состояния при успешной загрузке
      .addCase(getOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false; // Завершаем загрузку
        state.error = null; // Сбрасываем ошибки
        state.order = payload.orders[0]; // Сохраняем первый заказ из ответа
      });
  }
});

// Экспорт начального состояния для тестов или других частей приложения
export { initialState as orderInitialState };

// Экспорт селектора для получения данных заказа в компонентах
export const { getOrderSelector } = orderSlice.selectors;

// Экспорт редьюсера для добавления в store
export default orderSlice.reducer;
