// Импорт типов FC (Functional Component) и memo для оптимизации рендеринга.
import { FC, memo } from 'react';

// Импорт хука для работы с текущим местоположением.
import { useLocation } from 'react-router-dom';

// Импорт UI-компонента для отображения ингредиента.
import { BurgerIngredientUI } from '@ui';

// Импорт типа пропсов для компонента.
import { TBurgerIngredientProps } from './type';

// Импорт хука для отправки экшенов в Redux.
import { useDispatch } from '../../services/store';

// Импорт экшена для добавления ингредиента в конструктор.
import { addIngredient } from '@slices';

// Компонент для отображения отдельного ингредиента, обернутый в memo для оптимизации.
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    // Получение текущего местоположения для управления навигацией.
    const location = useLocation();

    // Хук для отправки экшенов в Redux.
    const dispatch = useDispatch();

    // Обработчик для добавления ингредиента в конструктор.
    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    // Рендер UI-компонента с передачей данных ингредиента и обработчика.
    return (
      <BurgerIngredientUI
        ingredient={ingredient} // Данные об ингредиенте.
        count={count} // Количество ингредиентов (например, если уже добавлено несколько).
        locationState={{ background: location }} // Состояние местоположения для модальных окон.
        handleAdd={handleAdd} // Обработчик добавления ингредиента.
      />
    );
  }
);
