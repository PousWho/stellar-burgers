import { useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { selectIngredientsStore } from '../../services/slices';

// Компонент страницы конструктора
export const ConstructorPage: FC = () => {
  // Получаем состояние загрузки ингредиентов из store
  const { isLoading: isIngredientsLoading } = useSelector(
    selectIngredientsStore
  );

  // Показываем Preloader, если идёт загрузка ингредиентов
  if (isIngredientsLoading) return <Preloader />;

  return (
    <main className={styles.containerMain}>
      {/* Заголовок страницы */}
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      {/* Основная часть страницы с компонентами */}
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients /> {/* Компонент выбора ингредиентов */}
        <BurgerConstructor /> {/* Компонент конструктора бургера */}
      </div>
    </main>
  );
};
