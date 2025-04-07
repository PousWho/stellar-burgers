import { configureStore } from '@reduxjs/toolkit';
import { expect, test, describe, beforeEach, jest } from '@jest/globals';
import userReducer, {
  registerUserThunk,
  loginUserThunk,
  logoutUserThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getUserThunk,
  clearError,
  userInitialState
} from './userSlice';

// Мокаем функции работы с cookies
jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

const { setCookie, deleteCookie } = require('../../utils/cookie');

const setupStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('Тесты userReducer', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Проверка pending состояния', () => {
    test('pending – ожидание для loginUserThunk', () => {
      store.dispatch({ type: loginUserThunk.pending.type });
      const state = store.getState().user;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('Проверка rejected состояния', () => {
    test('rejected – ошибка для loginUserThunk', () => {
      const errorMessage = 'Ошибка логина';
      store.dispatch({
        type: loginUserThunk.rejected.type,
        error: { message: errorMessage }
      });
      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('Проверка fulfilled состояний', () => {
    test('fulfilled – успешный логин', () => {
      const payload = {
        user: { name: 'User', email: 'user@example.com' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      };

      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    test('fulfilled – успешная регистрация', () => {
      const payload = {
        user: { name: 'NewUser', email: 'newuser@example.com' },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      };

      store.dispatch({
        type: registerUserThunk.fulfilled.type,
        payload
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    test('fulfilled – успешное обновление пользователя', () => {
      const initialUser = { name: 'User', email: 'user@example.com' };
      const newUser = { name: 'UpdatedUser', email: 'updated@example.com' };

      // Задаем начальное состояние – логин пользователя
      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: {
          user: initialUser,
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      });

      // Обновляем данные пользователя
      store.dispatch({
        type: updateUserThunk.fulfilled.type,
        payload: { user: newUser }
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(newUser);
    });

    test('fulfilled – успешное получение пользователя', () => {
      const payload = {
        user: { name: 'ExistingUser', email: 'existing@example.com' }
      };

      store.dispatch({
        type: getUserThunk.fulfilled.type,
        payload
      });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
    });

    test('fulfilled – успешный логаут', () => {
      // Сначала логиним пользователя
      store.dispatch({
        type: loginUserThunk.fulfilled.type,
        payload: {
          user: { name: 'User', email: 'user@example.com' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      });

      // Затем логаут
      store.dispatch({ type: logoutUserThunk.fulfilled.type });

      const state = store.getState().user;
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBe(false);
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    test('fulfilled – успешный сброс пароля', () => {
      // Для forgotPasswordThunk и resetPasswordThunk состояние изменяется только isLoading и error,
      // поэтому проверяем только их
      store.dispatch({
        type: forgotPasswordThunk.fulfilled.type,
        payload: {}
      });
      let state = store.getState().user;
      expect(state.isLoading).toBe(false);

      store.dispatch({
        type: resetPasswordThunk.fulfilled.type,
        payload: {}
      });
      state = store.getState().user;
      expect(state.isLoading).toBe(false);
    });
  });

  describe('Тест синхронного редьюсера', () => {
    test('clearError – очищает сообщение об ошибке', () => {
      // Устанавливаем ошибку через rejected экшен
      const errorMessage = 'Some error';
      store.dispatch({
        type: loginUserThunk.rejected.type,
        error: { message: errorMessage }
      });
      let state = store.getState().user;
      expect(state.error).toBe(errorMessage);

      // Очищаем ошибку
      store.dispatch(clearError());
      state = store.getState().user;
      expect(state.error).toBeNull();
    });
  });
});
