// Импорт хука для отслеживания видимости элемента на экране.
import { useInView } from 'react-intersection-observer';

// Импорт React-хуков для управления состоянием, рефами и эффектами.
import { useState, useRef, useEffect, FC } from 'react';

// Импорт типов для вкладок и ингредиентов.
import { TTabMode, TIngredient } from '@utils-types';

// Импорт UI-компонента для отображения ингредиентов бургера.
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

// Импорт хука для получения данных из Redux-хранилища.
import { useSelector } from '../../services/store';

// Импорт селектора для получения ингредиентов из хранилища.
import { getIngredientsSelector } from '@slices';

// Компонент для отображения ингредиентов бургера.
export const BurgerIngredients: FC = () => {
  // Получение списка ингредиентов из хранилища.
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  // Фильтрация ингредиентов по их типу (булки, основные, соусы).
  const buns = ingredients.filter((ingredient) => {
    if (ingredient.type === 'bun') {
      return ingredient;
    }
  });
  const mains = ingredients.filter((ingredient) => {
    if (ingredient.type === 'main') {
      return ingredient;
    }
  });
  const sauces = ingredients.filter((ingredient) => {
    if (ingredient.type === 'sauce') {
      return ingredient;
    }
  });

  // Состояние для текущей активной вкладки.
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Рефы для заголовков разделов (булки, начинки, соусы).
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Рефы для отслеживания видимости секций.
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Эффект для переключения текущей вкладки при изменении видимости секций.
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик для клика по вкладке. Скроллит к соответствующей секции.
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Рендер UI-компонента с передачей всех данных и обработчиков.
  return (
    <BurgerIngredientsUI
      currentTab={currentTab} // Текущая активная вкладка.
      buns={buns} // Список булок.
      mains={mains} // Список начинок.
      sauces={sauces} // Список соусов.
      titleBunRef={titleBunRef} // Реф заголовка булок.
      titleMainRef={titleMainRef} // Реф заголовка начинок.
      titleSaucesRef={titleSaucesRef} // Реф заголовка соусов.
      bunsRef={bunsRef} // Реф для отслеживания видимости булок.
      mainsRef={mainsRef} // Реф для отслеживания видимости начинок.
      saucesRef={saucesRef} // Реф для отслеживания видимости соусов.
      onTabClick={onTabClick} // Обработчик клика по вкладке.
    />
  );
};
