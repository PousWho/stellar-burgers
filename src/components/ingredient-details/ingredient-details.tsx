import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredientList } from '@slices';
import { useParams } from 'react-router-dom';

/**
 * Компонент для отображения деталей конкретного ингредиента.
 */
export const IngredientDetails: FC = () => {
  const { id: ingredientId } = useParams(); // Получаем ID ингредиента из URL
  const ingredients = useSelector(selectIngredientList); // Достаем ингредиенты из Redux-хранилища

  // Ищем нужный ингредиент по ID
  const ingredientData = ingredients.find(({ _id }) => _id === ingredientId);

  // Если ингредиент не найден, показываем прелоадер
  return ingredientData ? (
    <IngredientDetailsUI ingredientData={ingredientData} />
  ) : (
    <Preloader />
  );
};
