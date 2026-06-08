import { rootReducer } from './store';

import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { feedSlice } from './slices/feedSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { ordersSlice } from './slices/ordersSlice';
import { profileSlice } from './slices/profileSlice';

describe('rootReducer', () => {
  const initAction = { type: '@@INIT' };
  const unknownAction = { type: 'UNKNOWN_ACTION' };

  it('должен правильно инициализировать состояние store через @@INIT', () => {
    // Act: получаем состояние от rootReducer при инициализации
    const rootState = rootReducer(undefined, initAction);

    // Act: получаем ожидаемое состояние через отдельные редьюсеры
    const expectedState = {
      burgerConstructor: burgerConstructorSlice.reducer(undefined, initAction),
      feed: feedSlice.reducer(undefined, initAction),
      ingredients: ingredientsSlice.reducer(undefined, initAction),
      orders: ordersSlice.reducer(undefined, initAction),
      user: profileSlice.reducer(undefined, initAction)
    };

    // Assert: сравниваем полное состояние
    expect(rootState).toEqual(expectedState);
  });

  it('должен корректно обрабатывать неизвестный action', () => {
    // Arrange: сначала инициализируем состояние
    const initializedState = rootReducer(undefined, initAction);

    // Act: применяем неизвестный action
    const rootStateAfterUnknown = rootReducer(initializedState, unknownAction);

    // Act: получаем ожидаемое состояние через отдельные редьюсеры
    const expectedStateAfterUnknown = {
      burgerConstructor: burgerConstructorSlice.reducer(
        initializedState.burgerConstructor,
        unknownAction
      ),
      feed: feedSlice.reducer(initializedState.feed, unknownAction),
      ingredients: ingredientsSlice.reducer(
        initializedState.ingredients,
        unknownAction
      ),
      orders: ordersSlice.reducer(initializedState.orders, unknownAction),
      user: profileSlice.reducer(initializedState.user, unknownAction)
    };

    // Assert: состояние не должно измениться при неизвестном action
    expect(rootStateAfterUnknown).toEqual(expectedStateAfterUnknown);
  });
});
