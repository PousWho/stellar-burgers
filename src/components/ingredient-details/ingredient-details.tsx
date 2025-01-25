import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredientsSelector } from '@slices';
import { useParams } from 'react-router-dom';

// Компонент для отображения деталей конкретного ингредиента.
export const IngredientDetails: FC = () => {
  // Получение идентификатора ингредиента из параметров URL.
  const ingridientId = useParams().id;

  // Получение списка ингредиентов из хранилища.
  const ingredients = useSelector(getIngredientsSelector);

  // Поиск данных об ингредиенте по идентификатору.
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === ingridientId
  );

  // Если данные об ингредиенте не найдены, отображается прелоадер.
  if (!ingredientData) {
    return <Preloader />;
  }

  // Рендер UI-компонента с передачей данных об ингредиенте.
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
