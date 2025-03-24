// Хук для отслеживания видимости элементов на экране
import { useInView } from 'react-intersection-observer';
// React-хуки для состояния, рефов и эффектов
import { useState, useRef, useEffect, FC } from 'react';
// Типы для вкладок и ингредиентов
import { TTabMode, TIngredient } from '@utils-types';
// UI-компонент для отображения списка ингредиентов
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
// Хук для получения данных из Redux-хранилища
import { useSelector } from '../../services/store';
// Селектор для получения списка ингредиентов
import { selectIngredientList } from '@slices';

// Компонент списка ингредиентов для бургера
export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(selectIngredientList); // Получение ингредиентов из Redux

  // Разделение ингредиентов по категориям
  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  // Состояние для текущей активной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Рефы для заголовков секций
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Отслеживание видимости секций
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Обновление текущей вкладки при изменении видимости секций
  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по вкладке (скролл к нужному разделу)
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode); // Приводим строку к нужному типу

    const refMap: Record<string, React.RefObject<HTMLHeadingElement>> = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };

    refMap[tab]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Рендер UI-компонента с передачей данных и обработчиков
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
