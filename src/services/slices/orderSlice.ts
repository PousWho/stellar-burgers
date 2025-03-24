import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

// Интерфейс состояния заказа
export interface OrderState {
  isLoading: boolean; // Флаг загрузки
  order: TOrder | null; // Данные заказа
  error: string | null; // Сообщение об ошибке
}

// Начальное состояние
const initialState: OrderState = {
  isLoading: false,
  order: null,
  error: null
};

// Асинхронное действие для получения заказа по номеру
export const getOrderThunk = createAsyncThunk<TOrder, number>(
  'order/getOrder',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      if (!response.orders?.length) throw new Error('Заказ не найден');
      return response.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Слайс управления заказом
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    selectOrderState: (state) => state,
    selectOrder: (state) => state.order,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.order = payload;
      })
      .addCase(getOrderThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      });
  }
});

// Экспорты
export const { selectOrderState, selectOrder, selectIsLoading, selectError } =
  orderSlice.selectors;

export { initialState as orderInitialState };
export default orderSlice.reducer;
