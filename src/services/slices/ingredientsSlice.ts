import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Интерфейс состояния ингредиентов
export interface ingredientsState {
  isLoading: boolean; // Указывает, выполняется ли загрузка
  ingredients: TIngredient[]; // Массив ингредиентов
  error: string | null; // Сообщение об ошибке, если есть
}

// Начальное состояние
const initialState: ingredientsState = {
  isLoading: false, // Загрузка изначально не активна
  ingredients: [], // Список ингредиентов пуст
  error: null // Ошибок нет
};

// Асинхронное действие для получения ингредиентов
export const getIngredientsThunk = createAsyncThunk<TIngredient[], void>(
  'ingredients/get', // Имя действия
  async (_, { rejectWithValue }) => {
    try {
      // Запрос к API для получения ингредиентов
      const ingredients = await getIngredientsApi();
      return ingredients; // Возвращаем данные при успешном запросе
    } catch (error) {
      // Возвращаем ошибку, если запрос не удался
      return rejectWithValue((error as Error).message);
    }
  }
);

// Создание слайса для управления состоянием ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Обычные редьюсеры отсутствуют
  selectors: {
    // Селектор для получения полного состояния ингредиентов
    getIngredientsStateSelector: (state) => state,
    // Селектор для получения массива ингредиентов
    getIngredientsSelector: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      // Обработка состояния при начале загрузки
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.error = null; // Сбрасываем предыдущие ошибки
      })
      // Обработка состояния при ошибке загрузки
      .addCase(getIngredientsThunk.rejected, (state, { error }) => {
        state.isLoading = false; // Завершаем загрузку
        state.error = error.message as string; // Сохраняем сообщение об ошибке
      })
      // Обработка состояния при успешной загрузке
      .addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false; // Завершаем загрузку
        state.error = null; // Сбрасываем ошибки
        state.ingredients = payload; // Сохраняем загруженные ингредиенты
      });
  }
});

// Экспорт начального состояния для использования в тестах или других частях приложения
export { initialState as ingredientsInitialState };

// Экспорт селекторов для использования в компонентах
export const { getIngredientsStateSelector, getIngredientsSelector } =
  ingredientsSlice.selectors;

// Экспорт редьюсера для добавления в store
export default ingredientsSlice.reducer;
