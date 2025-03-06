import {
  PayloadAction,
  createSlice,
  createAsyncThunk,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder, TIngredient } from '@utils-types'; // Импорт типов
import { orderBurgerApi } from '@api'; // Импорт API для отправки заказа

// Описание состояния конструктора бургера
interface ConstructorState {
  isLoading: boolean; // Состояние загрузки (используется при асинхронных запросах)
  constructorItems: {
    bun: TConstructorIngredient | null; // Булочка бургера, может быть пустой
    ingredients: TConstructorIngredient[]; // Список ингредиентов в бургере
  };
  orderRequest: boolean; // Запрос на заказ в процессе
  orderModalData: TOrder | null; // Данные о заказе для модального окна
  error: string | null; // Ошибка, если она возникла
}

// Начальное состояние конструктора
const initialState: ConstructorState = {
  isLoading: false,
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Асинхронный экшен для отправки заказа в API
export const submitOrderAsync = createAsyncThunk(
  'constructorbg/sendOrder',
  orderBurgerApi
);

// Слайс для управления состоянием конструктора
const constructorSlice = createSlice({
  name: 'constructorbg', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Экшен для добавления ингредиента (булочка или обычный ингредиент)
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        // Если ингредиент булочка, обновляем булочку в состоянии
        action.payload.type === 'bun'
          ? (state.constructorItems.bun = action.payload)
          : state.constructorItems.ingredients.push(action.payload); // Если не булочка, добавляем в список ингредиентов
      },
      // Подготовка ингредиента с добавлением уникального ID
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    // Экшен для удаления ингредиента по его ID
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (i) => i.id !== action.payload
        );
    },
    // Экшен для обновления состояния запроса заказа
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    // Экшен для сброса данных о заказе в модальном окне
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    // Экшен для перемещения ингредиента в списке (вверх/вниз)
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const { ingredients } = state.constructorItems;
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      // Проверка, чтобы индекс не вышел за пределы списка
      if (swapIndex >= 0 && swapIndex < ingredients.length) {
        [ingredients[index], ingredients[swapIndex]] = [
          ingredients[swapIndex],
          ingredients[index]
        ]; // Меняем местами
      }
    }
  },
  extraReducers: (builder) => {
    // Обработка состояния при разных стадиях асинхронного экшена submitOrderAsync
    builder
      .addCase(submitOrderAsync.pending, (state) => {
        state.isLoading = true; // Запрос в процессе
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(submitOrderAsync.rejected, (state, { error }) => {
        state.isLoading = false; // Запрос завершен
        state.error = error.message || 'Unknown error'; // Устанавливаем ошибку
      })
      .addCase(submitOrderAsync.fulfilled, (state, { payload }) => {
        state.isLoading = false; // Запрос завершен
        state.orderRequest = false; // Запрос на заказ завершен
        state.orderModalData = payload.order; // Устанавливаем данные о заказе в модальном окне
        state.constructorItems = { bun: null, ingredients: [] }; // Очищаем конструктор
      });
  }
});

// Селектор для получения состояния конструктора
export const selectConstructorState = (state: {
  constructorbg: ConstructorState;
}) => state.constructorbg;

// Экспорт начального состояния, экшенов и редьюсера
export { initialState as constructorInitialState };
export const {
  addIngredient,
  removeIngredient,
  setOrderLoading,
  clearOrderModalData,
  moveIngredient
} = constructorSlice.actions;
export default constructorSlice.reducer;
