// Импорт React-хуков, типов FC (Functional Component) и ReactElement.
import { FC, ReactElement, memo, useEffect } from 'react';

// Импорт UI-компонента для элемента конструктора бургера.
import { BurgerConstructorElementUI } from '@ui';

// Импорт типа пропсов для компонента.
import { BurgerConstructorElementProps } from './type';

// Импорт хука для отправки экшенов в Redux.
import { useDispatch } from '../../services/store';

// Импорты экшенов для управления ингредиентами конструктора.
import {
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp
} from '@slices';

// Компонент элемента конструктора бургера, обернутый в memo для оптимизации рендеринга.
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    // Хук для отправки экшенов в Redux.
    const dispatch = useDispatch();

    // Обработчик для перемещения ингредиента вниз.
    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };

    // Обработчик для перемещения ингредиента вверх.
    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };

    // Обработчик для удаления ингредиента.
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    // Рендер UI-компонента с передачей всех необходимых данных и обработчиков.
    return (
      <BurgerConstructorElementUI
        ingredient={ingredient} // Данные об ингредиенте.
        index={index} // Индекс текущего ингредиента.
        totalItems={totalItems} // Общее количество ингредиентов.
        handleMoveUp={handleMoveUp} // Обработчик перемещения вверх.
        handleMoveDown={handleMoveDown} // Обработчик перемещения вниз.
        handleClose={handleClose} // Обработчик удаления ингредиента.
      />
    );
  }
);
