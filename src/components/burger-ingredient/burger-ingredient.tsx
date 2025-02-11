// Импорт необходимых хуков и типов
import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';

// Импорт UI-компонента и типов пропсов
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

// Импорт экшена для добавления ингредиента
import { addIngredient } from '@slices';

// Компонент ингредиента бургера
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation(); // Текущее местоположение (для модальных окон)
    const dispatch = useDispatch(); // Диспатч Redux-экшенов

    return (
      <BurgerIngredientUI
        ingredient={ingredient} // Данные ингредиента
        count={count} // Количество уже добавленных ингредиентов
        locationState={{ background: location }} // Состояние для модального окна
        handleAdd={() => dispatch(addIngredient(ingredient))} // Добавление ингредиента
      />
    );
  }
);
