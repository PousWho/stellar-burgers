import { describe, test, expect, jest } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  constructorInitialState
} from './constructorSlice';
import { nanoid } from '@reduxjs/toolkit';
import type { ConstructorState } from './constructorSlice';
import type { TIngredient } from '@utils-types';

jest.mock('@reduxjs/toolkit', () => {
  // Получаем оригинальный модуль и типизируем его
  const originalModule =
    jest.requireActual<typeof import('@reduxjs/toolkit')>('@reduxjs/toolkit');

  return {
    ...originalModule,
    nanoid: jest.fn(() => 'mockedID') // Мокаем только nanoid
  };
});

const getStartState = (): ConstructorState => ({
  ...JSON.parse(JSON.stringify(constructorInitialState)),
  constructorItems: {
    bun: {
      _id: 'bun_id',
      name: 'Булка',
      type: 'bun',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      id: 'bun1'
    },
    ingredients: [
      {
        _id: '1',
        name: 'Ингредиент 1',
        type: 'main',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 100,
        image: '',
        image_mobile: '',
        image_large: '',
        id: '1'
      },
      {
        _id: '2',
        name: 'Ингредиент 2',
        type: 'main',
        proteins: 2,
        fat: 2,
        carbohydrates: 2,
        calories: 2,
        price: 200,
        image: '',
        image_mobile: '',
        image_large: '',
        id: '2'
      }
    ]
  }
});

describe('constructorSlice', () => {
  test('добавляет ингредиент', () => {
    const startState = getStartState();
    const ingredient: TIngredient = {
      _id: '3',
      name: 'Новый',
      type: 'main',
      proteins: 3,
      fat: 3,
      carbohydrates: 3,
      calories: 3,
      price: 300,
      image: '',
      image_mobile: '',
      image_large: ''
    };

    const endState = constructorReducer(startState, addIngredient(ingredient));
    expect(nanoid).toHaveBeenCalled();
    expect(endState.constructorItems.ingredients).toContainEqual({
      ...ingredient,
      id: 'mockedID'
    });
  });

  test('удаляет ингредиент по id', () => {
    const startState = getStartState();
    const endState = constructorReducer(startState, removeIngredient('1'));
    expect(endState.constructorItems.ingredients.length).toBe(1);
    expect(endState.constructorItems.ingredients[0].id).toBe('2');
  });

  test('перемещает ингредиент вверх', () => {
    const startState = getStartState();
    const endState = constructorReducer(
      startState,
      moveIngredient({ index: 1, direction: 'up' })
    );

    expect(endState.constructorItems.ingredients[0].id).toBe('2');
    expect(endState.constructorItems.ingredients[1].id).toBe('1');
  });

  test('перемещает ингредиент вниз', () => {
    const startState = getStartState();
    const endState = constructorReducer(
      startState,
      moveIngredient({ index: 0, direction: 'down' })
    );

    expect(endState.constructorItems.ingredients[0].id).toBe('2');
    expect(endState.constructorItems.ingredients[1].id).toBe('1');
  });
});
