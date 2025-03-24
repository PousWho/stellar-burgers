// Импорты React-хуков и необходимых модулей
import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';

// Импорт UI-компонента и экшена для добавления ингредиента
import { BurgerIngredientUI } from '@ui';
import { addIngredient } from '@slices';

// Импорт типов пропсов для компонента
import { TBurgerIngredientProps } from './type';

// Компонент для отображения ингредиента бургера
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation(); // Получение текущего маршрута (для отображения модальных окон)
    const dispatch = useDispatch(); // Хук для отправки Redux-экшенов

    // Обработчик добавления ингредиента в конструктор бургера
    // useCallback предотвращает пересоздание функции при каждом рендере
    const handleAdd = useCallback(() => {
      dispatch(addIngredient(ingredient)); // Отправка экшена с выбранным ингредиентом
    }, [dispatch, ingredient]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient} // Данные об ингредиенте (название, цена, изображение и т.д.)
        count={count} // Количество добавленных ингредиентов данного типа
        locationState={{ background: location }} // Используется для открытия модального окна поверх текущей страницы
        handleAdd={handleAdd} // Функция добавления ингредиента
      />
    );
  }
);
