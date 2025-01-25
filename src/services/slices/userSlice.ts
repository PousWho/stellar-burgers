import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  refreshToken,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import type { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

// Интерфейс состояния пользователя
export interface UserState {
  isLoading: boolean; // Флаг загрузки
  user: TUser | null; // Данные пользователя
  isAuthorized: boolean; // Флаг авторизации
  error: string | null; // Сообщение об ошибке
}

// Начальное состояние
const initialState: UserState = {
  isLoading: false, // По умолчанию загрузка не идёт
  user: null, // Пользователь не определён
  isAuthorized: false, // Пользователь не авторизован
  error: null // Ошибок нет
};

// Асинхронные действия для работы с API

// Логин пользователя
export const loginUserThunk = createAsyncThunk(
  'user/login',
  (loginData: TLoginData) => loginUserApi(loginData)
);

// Регистрация пользователя
export const registerUserThunk = createAsyncThunk(
  'user/register',
  (registerData: TRegisterData) => registerUserApi(registerData)
);

// Логаут пользователя
export const logoutUserThunk = createAsyncThunk('user/logout', logoutApi);

// Обновление данных пользователя
export const updateUserThunk = createAsyncThunk(
  'user/update',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

// Запрос на восстановление пароля
export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  (data: { email: string }) => forgotPasswordApi(data)
);

// Сброс пароля
export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

// Получение текущего пользователя
export const getUserThunk = createAsyncThunk('user/get', getUserApi);

// Создание слайса
export const userSlice = createSlice({
  name: 'user', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Очистка ошибок
    clearUserError: (state) => {
      state.error = null; // Сбрасываем ошибку
    }
  },
  selectors: {
    // Селектор для получения состояния пользователя
    getUserStateSelector: (state) => state,
    // Селектор для получения данных пользователя
    getUserSelector: (state) => state.user,
    // Селектор для проверки авторизации
    isAuthorizedSelector: (state) => state.isAuthorized,
    // Селектор для получения ошибки
    getUserErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    // Обработка логина
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken); // Устанавливаем accessToken
        localStorage.setItem('refreshToken', payload.refreshToken); // Сохраняем refreshToken
      });

    // Обработка регистрации
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      });

    // Обработка логаута
    builder
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.isAuthorized = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      });

    // Обновление пользователя
    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
      });

    // Забыл пароль
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      });

    // Сброс пароля
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      });

    // Получение пользователя
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
      });
  }
});

// Экспорт начального состояния
export { initialState as userInitialState };

// Экспорт действий
export const { clearUserError } = userSlice.actions;

// Экспорт селекторов
export const {
  getUserStateSelector,
  getUserSelector,
  isAuthorizedSelector,
  getUserErrorSelector
} = userSlice.selectors;

// Экспорт редьюсера
export default userSlice.reducer;
