import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

// Определение интерфейса состояния ленты заказов
export interface FeedState {
  isLoading: boolean; // Флаг загрузки
  orders: TOrder[]; // Массив заказов
  total: number; // Общее количество заказов за все время
  totalToday: number; // Количество заказов за сегодня
  error: string | null; // Ошибка при загрузке данных
}

// Начальное состояние редьюсера
const initialState: FeedState = {
  isLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

// Асинхронный экшен для получения общей ленты заказов
export const getFeedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);

// Асинхронный экшен для получения заказов пользователя
export const getOrdersThunk = createAsyncThunk('feed/getProfileFeed', getOrdersApi);

// Функция для установки состояния загрузки
const setLoadingState = (state: FeedState) => {
  state.isLoading = true;
  state.error = null;
};

// Функция для установки ошибки
const setErrorState = (state: FeedState, error: string | undefined) => {
  state.isLoading = false;
  state.error = error ?? 'Unknown error'; // Если error undefined, устанавливаем "Unknown error"
};

// Создание слайса состояния для ленты заказов
const feedSlice = createSlice({
  name: 'feed', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Обычные редьюсеры (в данном случае не используются)
  selectors: {
    selectFeed: (state) => state, // Селектор для получения всего состояния ленты
    selectOrders: (state) => state.orders // Селектор для получения массива заказов
  },
  extraReducers: (builder) => {
    builder
      // Обработка загрузки ленты заказов
      .addCase(getFeedThunk.pending, setLoadingState)
      .addCase(getFeedThunk.rejected, (state, { error }) =>
        setErrorState(state, error.message)
      )
      .addCase(getFeedThunk.fulfilled, (state, { payload }) => {
        Object.assign(state, {
          isLoading: false,
          error: null,
          orders: payload.orders, // Сохраняем заказы в состояние
          total: payload.total, // Общее количество заказов
          totalToday: payload.totalToday // Количество заказов за сегодня
        });
      })
      // Обработка загрузки заказов пользователя
      .addCase(getOrdersThunk.pending, setLoadingState)
      .addCase(getOrdersThunk.rejected, (state, { error }) =>
        setErrorState(state, error.message)
      )
      .addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orders = payload; // Обновляем заказы пользователя
      });
  }
});

// Экспорт селекторов для удобного доступа к данным
export const { selectFeed, selectOrders } = feedSlice.selectors;

// Экспорт начального состояния (если нужно использовать отдельно)
export { initialState as feedInitialState };

// Экспорт редьюсера слайса
export default feedSlice.reducer;
