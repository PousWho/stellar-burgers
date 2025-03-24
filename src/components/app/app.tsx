// Импорт React и хука useEffect для работы с эффектами.
import React, { useEffect } from 'react';

// Импорты компонентов и хуков из react-router-dom для работы с маршрутизацией.
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';

// Импорт хранилища Redux.
import store from '../../services/store';

// Подключение глобальных и модульных стилей.
import '../../index.css';
import styles from './app.module.css';

// Кастомные хуки Redux для удобства работы с dispatch и selector.
import { useDispatch, useSelector } from '../../services/store';

// Импорты страниц приложения.
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

// Импорты общих компонентов.
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Center } from '../title-center';
// Импорт компонента для защиты маршрутов.
import { ProtectedRoute } from '../protected-route';

// Импорты экшенов и селекторов Redux.
import { fetchIngredientsAsync, selectUserState, getUserThunk } from '@slices';

// Импорт компонента Preloader для отображения загрузки.
//import { Preloader } from '../ui/preloader';

// Импорт провайдера Redux.
import { Provider } from 'react-redux';

const App = () => {
  // Хук для получения текущего местоположения.
  const location = useLocation();

  // Хук для управления переходами.
  const navigate = useNavigate();

  // Хук для отправки экшенов в Redux.
  const dispatch = useDispatch();

  // Получение статуса загрузки пользователя из хранилища.
  //const userLoading = useSelector(selectUserState).isLoading;

  // Проверка, если есть фоновое местоположение для модальных окон.
  const backgroundLocation = location.state?.background;

  // Выполнение эффектов при монтировании компонента.
  useEffect(() => {
    // Запрос данных о пользователе.
    dispatch(getUserThunk());
    // Запрос данных об ингредиентах.
    dispatch(fetchIngredientsAsync());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      {/* Хедер приложения */}
      <AppHeader />
      {/* Определение маршрутов */}
      <Routes location={backgroundLocation || location}>
        {/* Главная страница конструктора */}
        <Route path='/' element={<ConstructorPage />} />
        {/* Страница с деталями ингредиента */}
        <Route
          path='/ingredients/:id'
          element={
            <Center title={`Детали ингредиента`}>
              <IngredientDetails />
            </Center>
          }
        />
        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />
        {/* Информация о заказе в ленте */}
        <Route
          path='/feed/:number'
          element={
            <Center title={`#${location.pathname.match(/\d+/)}`}>
              <OrderInfo />
            </Center>
          }
        />
        {/* Маршруты для гостей */}
        <Route element={<ProtectedRoute forAuthorized={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        {/* Маршруты для авторизованных пользователей */}
        <Route element={<ProtectedRoute forAuthorized />}>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route path='orders/:number' element={<OrderInfo />} />
          </Route>
        </Route>
        {/* Страница не найдена */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {/* Обработка модальных окон */}
      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${location.pathname.match(/\d+/)}`}
                onClose={() => navigate(-1)}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute forAuthorized />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title={`#${location.pathname.match(/\d+/)}`}
                  onClose={() => navigate('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

// Провайдер Redux и маршрутизатор оборачивают приложение.
const RootApp = () => (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

export default RootApp;
