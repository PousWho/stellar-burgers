import { rootReducer } from './store';
import {
  userInitialState,
  orderInitialState,
  inginitialState,
  feedInitialState,
  constructorInitialState
} from '@slices';

test('rootReducer возвращает начальное состояние при неизвестном экшене', () => {
  const unknownAction = { type: 'UNKNOWN_ACTION' };
  const state = rootReducer(undefined, unknownAction);

  expect(state).toEqual({
    user: userInitialState,
    feed: feedInitialState,
    order: orderInitialState,
    ingredients: inginitialState,
    constructorbg: constructorInitialState
  });
});
