// Импорт типа FC (Functional Component), memo для мемоизации, хука useEffect и useState.
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
const modalRoot = document.getElementById('modals');

// Компонент для отображения модального окна с поддержкой мемоизации.
export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  // Получение текущего местоположения (путь) из URL.
  const location = useLocation();

  // Состояние для определения стиля заголовка в модальном окне.
  const [titleStyle, setTitleStyle] = useState('text_type_main-large');

  // Эффект для изменения стиля заголовка в зависимости от пути.
  useEffect(() => {
    // Если путь содержит 'feed' или 'profile', меняем стиль заголовка.
    if (/feed|profile/i.test(location.pathname)) {
      setTitleStyle('text_type_digits-default');
    }
  });

  // Эффект для обработки нажатия клавиши Escape для закрытия модального окна.
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose(); // Закрытие модального окна при нажатии на Escape.
      }
    };

    // Добавление слушателя события для клавиши Escape.
    document.addEventListener('keydown', handleEsc);

    // Очистка слушателя при размонтировании компонента.
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]); // Эффект зависит от функции onClose.

  // Рендеринг модального окна через портал (вывод в отдельный контейнер).
  return ReactDOM.createPortal(
    // Рендерим UI компонента модального окна с переданными пропсами.
    <ModalUI title={title} onClose={onClose} titleStyle={titleStyle}>
      {children} {/* Контент модального окна. */}
    </ModalUI>,
    modalRoot as HTMLDivElement // Отправляем в корневой элемент для модальных окон.
  );
});
