import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as dispatchHook, useSelector as selectorHook } from 'react-redux';

import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';

// Создание store
const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    order: orderReducer,
    ingredients: ingredientsReducer,
    constructorbg: constructorReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

// Типизация
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки
export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
