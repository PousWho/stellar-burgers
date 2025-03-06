import { FC, memo } from 'react'; // Импорт функционального компонента и мемоизации
import { BurgerConstructorElementUI } from '@ui'; // Импорт компонента UI для отображения элемента конструктора бургера
import { BurgerConstructorElementProps } from './type'; // Типы для пропсов компонента
import { useDispatch } from '../../services/store'; // Хук для получения dispatch функции из хранилища
import { removeIngredient, moveIngredient } from '@slices'; // Импорт экшенов для удаления и перемещения ингредиентов

// Компонент BurgerConstructorElement для отображения одного ингредиента конструктора
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  // Мемоизация компонента, чтобы избежать лишних перерендеров, если пропсы не изменились
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // Получаем dispatch для отправки экшенов

    return (
      // UI компонент для отображения ингредиента конструктора
      <BurgerConstructorElementUI
        ingredient={ingredient} // Передаем информацию об ингредиенте
        index={index} // Передаем индекс ингредиента в списке
        totalItems={totalItems} // Общее количество ингредиентов (для отображения)
        handleMoveUp={() =>
          dispatch(moveIngredient({ index, direction: 'up' }))
        } // Функция для перемещения вверх
        handleMoveDown={() =>
          dispatch(moveIngredient({ index, direction: 'down' }))
        } // Функция для перемещения вниз
        handleClose={() => dispatch(removeIngredient(ingredient.id))} // Функция для удаления ингредиента по ID
      />
    );
  }
);
