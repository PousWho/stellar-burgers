import { useSelector, AppDispatch, useDispatch } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { getIngredientsStateSelector } from '../../services/slices';

// Определение компонента страницы конструктора
export const ConstructorPage: FC = () => {
  // Получение состояния загрузки ингредиентов из store через селектор
  const { isLoading: isIngredientsLoading } = useSelector(
    getIngredientsStateSelector
  );

  return (
    <>
      {/* Если идёт загрузка ингредиентов, показываем Preloader */}
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        // Если загрузка завершена, отображаем основной контент страницы
        <main className={styles.containerMain}>
          {/* Заголовок страницы */}
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          {/* Основная часть страницы с двумя компонентами */}
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients /> {/* Компонент выбора ингредиентов */}
            <BurgerConstructor /> {/* Компонент конструктора бургера */}
          </div>
        </main>
      )}
    </>
  );
};
