import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export interface ingredientsState {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
}

const initialState: ingredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

// Thunk для получения ингредиентов
export const getIngredientsThunk = createAsyncThunk<TIngredient[], void>(
  'ingredients/get',
  async (_, { rejectWithValue }) => {
    try {
      const ingredients = await getIngredientsApi();
      console.log(ingredients);
      return ingredients;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsStateSelector: (state) => state,
    getIngredientsSelector: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients = payload;
      });
  }
});

export { initialState as ingredientsInitialState };
export const { getIngredientsStateSelector, getIngredientsSelector } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
