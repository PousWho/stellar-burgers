import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import type { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

/** 
 * Интерфейс состояния пользователя в Redux store.
 */
interface UserState {
  isLoading: boolean;      // Флаг для отображения состояния загрузки (например, показывать спиннер).
  user: TUser | null;      // Объект с данными пользователя или null, если пользователь не авторизован.
  isAuthorized: boolean;   // Флаг, показывающий авторизован ли пользователь.
  error: string | null;    // Сообщение об ошибке, если что-то пошло не так.
}

/** 
 * Начальное состояние пользователя.
 */
const initialState: UserState = {
  isLoading: false,    // Изначально ничего не загружается.
  user: null,          // Нет данных пользователя при инициализации.
  isAuthorized: false, // Пользователь изначально не авторизован.
  error: null          // Ошибок нет.
};

/** 
 * Универсальный обработчик для `pending` состояния.
 * Используется, когда запрос начат, но ещё не завершён.
 */
const setLoadingState = (state: UserState) => {
  state.isLoading = true;  // Включаем индикатор загрузки.
  state.error = null;      // Сбрасываем старые ошибки.
};

/** 
 * Универсальный обработчик для `rejected` состояния.
 * Используется, если запрос завершился с ошибкой.
 */
const setErrorState = (state: UserState, { error }: { error: { message?: string } }) => {
  state.isLoading = false;                               // Выключаем индикатор загрузки.
  state.error = error.message ?? 'Произошла ошибка';     // Сохраняем сообщение об ошибке или дефолтное.
};

/** 
 * Асинхронные экшены (thunks) для взаимодействия с API.
 * Они автоматически создают три состояния: pending, fulfilled, rejected.
 */
// Регистрация пользователя
export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => await registerUserApi(registerData)
);

// Логин пользователя
export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => await loginUserApi(loginData)
);

// Логаут пользователя
export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

// Обновление данных пользователя
export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

// Запрос для восстановления пароля
export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => await forgotPasswordApi(data)
);

// Сброс пароля по токену
export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => await resetPasswordApi(data)
);

// Получение текущего пользователя (например, для проверки авторизации после обновления страницы)
export const getUserThunk = createAsyncThunk(
  'user/get',
  async () => await getUserApi()
);

/** 
 * Создание слайса состояния пользователя.
 * Здесь определяются reducers, selectors и обработка асинхронных экшенов (extraReducers).
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** 
     * Очищает сообщение об ошибке.
     */
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    /** 
     * Селектор для получения всего состояния пользователя.
     */
    selectUserState: (state) => state,

    /** 
     * Селектор для получения данных пользователя.
     */
    selectUser: (state) => state.user,

    /** 
     * Селектор для проверки, авторизован ли пользователь.
     */
    selectIsAuthorized: (state) => state.isAuthorized,

    /** 
     * Селектор для получения сообщения об ошибке.
     */
    selectUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      /** 
       * Обработка pending состояния для всех асинхронных экшенов.
       * Это позволяет показывать индикатор загрузки.
       */
      .addCase(loginUserThunk.pending, setLoadingState)
      .addCase(registerUserThunk.pending, setLoadingState)
      .addCase(logoutUserThunk.pending, setLoadingState)
      .addCase(updateUserThunk.pending, setLoadingState)
      .addCase(forgotPasswordThunk.pending, setLoadingState)
      .addCase(resetPasswordThunk.pending, setLoadingState)
      .addCase(getUserThunk.pending, setLoadingState)

      /** 
       * Обработка rejected состояния для всех асинхронных экшенов.
       * Это позволяет сохранять сообщение об ошибке.
       */
      .addCase(loginUserThunk.rejected, setErrorState)
      .addCase(registerUserThunk.rejected, setErrorState)
      .addCase(logoutUserThunk.rejected, setErrorState)
      .addCase(updateUserThunk.rejected, setErrorState)
      .addCase(forgotPasswordThunk.rejected, setErrorState)
      .addCase(resetPasswordThunk.rejected, setErrorState)
      .addCase(getUserThunk.rejected, setErrorState)

      /** 
       * Успешный логин:
       * - Сохраняет данные пользователя.
       * - Ставит флаг авторизации в true.
       * - Сохраняет токены в cookies и localStorage.
       */
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);                 // Сохраняем accessToken в cookies.
        localStorage.setItem('refreshToken', payload.refreshToken);    // Сохраняем refreshToken в localStorage.
      })

      /** 
       * Успешная регистрация:
       * Работает аналогично логину – авторизует пользователя после регистрации.
       */
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })

      /** 
       * Успешное обновление данных пользователя.
       */
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;    // Обновляем данные пользователя.
      })

      /** 
       * Успешное получение пользователя:
       * Используется для восстановления состояния после перезагрузки страницы.
       */
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;    // Если пользователь получен, значит он авторизован.
      })

      /** 
       * Успешный логаут:
       * - Очищает данные пользователя.
       * - Снимает флаг авторизации.
       * - Удаляет токены из cookies и localStorage.
       */
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthorized = false;
        deleteCookie('accessToken');                   // Удаляем accessToken.
        localStorage.removeItem('refreshToken');      // Удаляем refreshToken.
      });
  }
});

/** 
 * Экспорт начального состояния (например, для сброса в тестах).
 */
export { initialState as userInitialState };

/** 
 * Экспорт экшенов.
 */
export const { clearError } = userSlice.actions;

/** 
 * Экспорт селекторов для доступа к данным в компонентах.
 */
export const {
  selectUserState,
  selectUser,
  selectIsAuthorized,
  selectUserError
} = userSlice.selectors;

/** 
 * Экспорт редьюсера для подключения в store.
 */
export default userSlice.reducer;
