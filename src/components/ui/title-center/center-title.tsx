import { FC, memo } from 'react';

import styles from './title-center.module.css';
import { TCenterUI } from './type';

/**
 * Компонент `CenterUI` центрирует содержимое и добавляет заголовок
 */
export const CenterUI: FC<TCenterUI> = memo(({ title, titleStyle, children }) => {
  return (
    <div className={styles.center}>
      {/* Заголовок */}
      <div className={styles.header}>
        <h3 className={`${styles.title} text ${titleStyle || ''}`.trim()}>{title}</h3>
      </div>

      {/* Контент */}
      <div className={styles.content}>{children}</div>
    </div>
  );
});
