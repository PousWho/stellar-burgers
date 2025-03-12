import { FC, memo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { TCenter } from './type';
import { CenterUI } from '../ui/title-center';

/**
 * Компонент `Center` управляет стилем заголовка в зависимости от пути.
 */
export const Center: FC<TCenter> = memo(({ title, children }) => {
  const location = useLocation();
  const [titleStyle, setTitleStyle] = useState('text_type_main-large');

  useEffect(() => {
    if (/feed|profile/i.test(location.pathname)) {
      setTitleStyle('text_type_digits-default');
    } else {
      setTitleStyle('text_type_main-large');
    }
  }, [location.pathname]); // Добавили зависимость, чтобы эффект не срабатывал без необходимости

  return <CenterUI title={title} titleStyle={titleStyle}>{children}</CenterUI>;
});
