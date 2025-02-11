import { FC, memo } from 'react';
// UI-компонент элемента конструктора
import { BurgerConstructorElementUI } from '@ui';
// Типы пропсов
import { BurgerConstructorElementProps } from './type';
// Хук для работы с Redux
import { useDispatch } from '../../services/store';
// Экшены для управления ингредиентами
import { removeIngredient, moveIngredientDown, moveIngredientUp } from '@slices';

// Компонент элемента конструктора бургера
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient} // Данные ингредиента
        index={index} // Индекс в списке
        totalItems={totalItems} // Общее количество ингредиентов
        handleMoveUp={() => dispatch(moveIngredientUp(index))} // Переместить вверх
        handleMoveDown={() => dispatch(moveIngredientDown(index))} // Переместить вниз
        handleClose={() => dispatch(removeIngredient(ingredient.id))} // Удалить
      />
    );
  }
);
