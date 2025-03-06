import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Интерфейс состояния ингредиентов
interface IngredientsState {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
}

// Начальное состояние
const initialState: IngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null,
};

// Асинхронное действие для получения ингредиентов
export const fetchIngredientsAsync = createAsyncThunk(
  'ingredients/get',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Слайс управления ингредиентами
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredientsStore: (state) => state,
    selectIngredientList: (state) => state.ingredients,
  },
  extraReducers: ({ addCase }) => {
    addCase(fetchIngredientsAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    addCase(fetchIngredientsAsync.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.ingredients = payload;
    });
    addCase(fetchIngredientsAsync.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload as string;
    });
  },
});

export const { selectIngredientsStore, selectIngredientList } = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;