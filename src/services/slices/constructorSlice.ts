import {
  PayloadAction,
  createSlice,
  createAsyncThunk,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder, TIngredient } from '@utils-types';
import { orderBurgerApi } from '@api';

// Тип состояния для конструктора бургера
export interface ConstructorState {
  isLoading: boolean; // Показывает, выполняется ли запрос на сервер
  constructorItems: {
    bun: TConstructorIngredient | null; // Хранит выбранную булочку (если есть)
    ingredients: TConstructorIngredient[]; // Хранит список выбранных ингредиентов
  };
  orderRequest: boolean; // Указывает, активен ли процесс заказа
  orderModalData: TOrder | null; // Содержит данные заказа для отображения в модальном окне
  error: string | null; // Хранит сообщение об ошибке (если есть)
}

// Начальное состояние конструктора
const initialState: ConstructorState = {
  isLoading: false, // Изначально запросы не выполняются
  constructorItems: {
    bun: null, // Булочка не выбрана
    ingredients: [] // Список ингредиентов пуст
  },
  orderRequest: false, // Процесс заказа не активен
  orderModalData: null, // Нет данных для модального окна
  error: null // Ошибок нет
};

// Асинхронный thunk для отправки заказа на сервер
export const sendOrderThunk = createAsyncThunk(
  'constructorbg/sendOrder',
  (data: string[]) => orderBurgerApi(data) // Вызывает API для отправки данных
);

// Создание слайса с действиями и редьюсерами
const constructorSlice = createSlice({
  name: 'constructorbg', // Уникальное имя слайса
  initialState, // Используем начальное состояние
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload; // Если это булочка, заменяем текущую
        } else {
          state.constructorItems.ingredients.push(action.payload); // Добавляем обычный ингредиент в список
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() } // Генерируем уникальный ID для ингредиента
      })
    },
    // Удаление ингредиента из списка
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload // Удаляем ингредиент по ID
        );
    },
    // Установка состояния процесса заказа
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload; // Обновляем статус запроса
    },
    // Сброс данных модального окна
    setNullOrderModalData: (state) => {
      state.orderModalData = null; // Очищаем данные модального окна
    },
    // Перемещение ингредиента вниз в списке
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const index = action.payload; // Индекс текущего ингредиента
      if (index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ]; // Меняем местами текущий и следующий ингредиенты
      }
    },
    // Перемещение ингредиента вверх в списке
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const index = action.payload; // Индекс текущего ингредиента
      if (index > 0) {
        [ingredients[index], ingredients[index - 1]] = [
          ingredients[index - 1],
          ingredients[index]
        ]; // Меняем местами текущий и предыдущий ингредиенты
      }
    }
  },
  extraReducers: (builder) => {
    // Обработка состояния при отправке заказа
    builder
      .addCase(sendOrderThunk.pending, (state) => {
        state.isLoading = true; // Устанавливаем состояние загрузки
        state.error = null; // Очищаем сообщение об ошибке
      })
      .addCase(sendOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false; // Останавливаем загрузку
        state.error = error.message || 'Unknown error'; // Сохраняем сообщение об ошибке
      })
      .addCase(sendOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false; // Завершаем загрузку
        state.error = null; // Сбрасываем ошибку
        state.orderRequest = false; // Завершаем процесс заказа
        state.orderModalData = payload.order; // Сохраняем данные заказа
        state.constructorItems = {
          bun: null,
          ingredients: [] // Очищаем конструктор
        };
      });
  }
});

// Селектор для получения данных конструктора
export const getConstructorSelector = (state: {
  constructorbg: ConstructorState;
}) => state.constructorbg; // Возвращает данные из состояния конструктора

// Экспорт начального состояния и экшенов
export { initialState as constructorInitialState };
export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setNullOrderModalData,
  moveIngredientDown,
  moveIngredientUp
} = constructorSlice.actions;

// Экспорт редьюсера по умолчанию
export default constructorSlice.reducer;
