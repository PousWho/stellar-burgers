// Импорт типа FC (Functional Component), memo для мемоизации, а также хуков useEffect и useState.
import { FC, memo, useEffect, useState } from 'react';

// Импорт ReactDOM для рендеринга компонента в портал (внешний контейнер).
import ReactDOM from 'react-dom';

// Импорт типа для свойств модального окна.
import { TModalProps } from './type';

// Импорт UI-компонента модального окна.
import { ModalUI } from '@ui';

// Импорт хука useLocation для получения информации о текущем URL.
import { useLocation } from 'react-router-dom';

// Получение корневого элемента для модальных окон из DOM.
const modalRoot = document.getElementById('modals') as HTMLDivElement;

// Компонент для отображения модального окна с поддержкой мемоизации.
export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  // Получение текущего пути из URL.
  const { pathname } = useLocation();

  // Состояние для определения стиля заголовка в модальном окне.
  const [titleStyle, setTitleStyle] = useState('text_type_main-large');

  // Эффект для изменения стиля заголовка в зависимости от пути.
  useEffect(() => {
    setTitleStyle(/feed|profile/i.test(pathname) ? 'text_type_digits-default' : 'text_type_main-large');
  }, [pathname]); // Добавил зависимость, чтобы эффект срабатывал при изменении пути.

  // Эффект для обработки нажатия клавиши Escape.
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Рендер модального окна через портал.
  return modalRoot
    ? ReactDOM.createPortal(
        <ModalUI title={title} onClose={onClose} titleStyle={titleStyle}>
          {children}
        </ModalUI>,
        modalRoot
      )
    : null; // Добавил проверку, если modalRoot по какой-то причине null.
});
