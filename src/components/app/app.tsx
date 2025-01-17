import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import store from '../../services/store';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store'; // хуки из store
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
import {
  HeaderApp,
  Modal,
  OrderInfo,
  IngredientDetails,
} from '@components';
import { ProtectedRoute } from '../protected-route'
import {
  getIngredientsThunk,
  getUserStateSelector,
  getUserThunk
} from '@slices';
import { Preloader } from '../ui/preloader';
import { Provider } from 'react-redux';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const { isLoading } = useSelector(getUserStateSelector);
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(getUserThunk());
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  //if (isLoading) {
   // return <Preloader />;
  //}

  return (
    <div className={styles.app}>
      <HeaderApp />
      <Routes location={backgroundLocation || location}>
        {/* Главная страница */}
        <Route path='/' element={<ConstructorPage />} />

        {/* Страница деталей ингредиента */}
        <Route
          path='/ingredients/:id'
          element={<IngredientDetails />}
        />

        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={<OrderInfo />}
        />

        {/* Маршруты для гостей */}
        <Route element={<ProtectedRoute forAuthorized={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        {/* Маршруты для авторизованных пользователей */}
        <Route element={<ProtectedRoute forAuthorized={true} />}>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route
              path='orders/:number'
              element={<OrderInfo />}
            />
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
              <Modal
                title="Детали ингредиента"
                onClose={() => navigate(-1)}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute forAuthorized={true} />}>
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

const RootApp = () => (
  <Provider store={store}>
  <Router>
    <App />
  </Router>
  </Provider>
);

export default RootApp;
