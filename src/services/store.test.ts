import { expect, test, describe } from '@jest/globals';
import store from './store';
import {
  userInitialState,
  orderInitialState,
  inginitialState,
  feedInitialState,
  constructorInitialState
} from '@slices';

describe('Тест store', () => {
  test('Store должен содержать корректный initial state', () => {
    const state = store.getState();

    expect(state).toEqual({
      user: userInitialState,
      feed: feedInitialState,
      order: orderInitialState,
      ingredients: inginitialState,
      constructorbg: constructorInitialState
    });
  });
});
