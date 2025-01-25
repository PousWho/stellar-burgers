import { combineReducers, configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Комбинируем редьюсеры в корневой редьюсер
export const rootReducer = combineReducers({
  user: userReducer, // Редьюсер для пользователя
  feed: feedReducer, // Редьюсер для ленты
  order: orderReducer, // Редьюсер для заказов
  ingredients: ingredientsReducer, // Редьюсер для ингредиентов
  constructorbg: constructorReducer // Редьюсер для конструктора
});

// Создаём хранилище
const store = configureStore({
  reducer: rootReducer, // Устанавливаем корневой редьюсер
  devTools: process.env.NODE_ENV !== 'production' // Включаем devTools только в режиме разработки
});

// Тип состояния хранилища
export type RootState = ReturnType<typeof rootReducer>;

// Тип для диспатча
export type AppDispatch = typeof store.dispatch;

// Кастомные хуки для работы с диспатчем и селекторами
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Экспортируем хранилище по умолчанию
export default store;
