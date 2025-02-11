// Импорт forwardRef для передачи ref, а также useMemo для оптимизации вычислений.
import { forwardRef, useMemo } from 'react';

// Импорт типов для свойств компонента и ингредиента.
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';

// Импорт UI-компонента для отображения категории ингредиентов.
import { IngredientsCategoryUI } from '../ui/ingredients-category';

// Импорт хука для получения данных из Redux-хранилища.
import { useSelector } from '../../services/store';

// Импорт селектора для получения данных о конструкторе бургера.
import { getConstructorSelector } from '@slices';

/**
 * Компонент для отображения категории ингредиентов с поддержкой передачи ref.
 */
export const IngredientsCategory = forwardRef<
  HTMLUListElement, // Тип передаваемого ref (список UL).
  TIngredientsCategoryProps // Тип свойств компонента.
>(({ title, titleRef, ingredients }, ref) => {
  // Получение данных о текущем состоянии конструктора бургера из Redux-хранилища.
  const { bun, ingredients: constructorIngredients } = useSelector(getConstructorSelector).constructorItems;

  // Определение счетчиков для ингредиентов в конструкторе.
  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {}; // Объект для хранения количества каждого ингредиента.

    // Подсчет количества ингредиентов в конструкторе.
    constructorIngredients.forEach(({ _id }: TIngredient) => {
      counters[_id] = (counters[_id] || 0) + 1;
    });

    // Если есть булка, добавляем двойной счетчик.
    if (bun) counters[bun._id] = 2;

    return counters;
  }, [bun, constructorIngredients]); // Пересчет происходит только при изменении конструктора.

  // Рендер UI-компонента для категории ингредиентов с передачей необходимых данных.
  return (
    <IngredientsCategoryUI
      title={title} // Название категории.
      titleRef={titleRef} // Ссылка на заголовок категории.
      ingredients={ingredients} // Список ингредиентов в категории.
      ingredientsCounters={ingredientsCounters} // Счетчики ингредиентов.
      ref={ref} // Передача ref для списка UL.
    />
  );
});
