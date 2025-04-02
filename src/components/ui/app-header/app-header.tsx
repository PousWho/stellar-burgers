import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

// Компонент AppHeaderUI - шапка приложения
export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {/* Ссылка на главную страницу */}
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {/* Иконка "Конструктор", меняет цвет в зависимости от активности */}
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} /> 
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        {/* Ссылка на ленту заказов */}
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {/* Иконка "Лента заказов", меняет цвет в зависимости от активности */}
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>
      
      {/* Логотип */}
      <div className={styles.logo}>
        <NavLink to='/'>
          <Logo className='' />
        </NavLink>
      </div>
      
      {/* Ссылка на профиль пользователя */}
      <NavLink
        to='/profile'
        className={({ isActive }) =>
          `${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
        }
      >
        {({ isActive }) => (
          <>
            {/* Иконка "Профиль", меняет цвет в зависимости от активности */}
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
