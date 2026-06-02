import { TConstructorIngredient } from '@utils-types';
import {
  addIngredient,
  burgerConstructorSlice,
  fetchOrder,
  moveIngredient,
  removeIngredient,
  setBun
} from './burgerConstructorSlice';

describe('burgerConstructorSlice', () => {
  const initialState = burgerConstructorSlice.getInitialState();

  // Вспомогательные константы для переиспользования
  const MOCK_BUN: TConstructorIngredient = {
    _id: '2',
    name: 'Булка',
    type: 'bun',
    price: 50,
    image: '',
    image_mobile: '',
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    proteins: 0
  };

  const MOCK_INGREDIENT_1: TConstructorIngredient = {
    _id: '1',
    name: 'Котлета 1',
    type: 'main',
    price: 100,
    image: '',
    image_mobile: '',
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    proteins: 0
  };

  const MOCK_INGREDIENT_2: TConstructorIngredient = {
    _id: '2',
    name: 'Котлета 2',
    type: 'main',
    price: 120,
    image: '',
    image_mobile: '',
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    proteins: 0
  };

  const MOCK_INGREDIENT_3: TConstructorIngredient = {
    _id: '3',
    name: 'Котлета 3',
    type: 'main',
    price: 110,
    image: '',
    image_mobile: '',
    calories: 0,
    carbohydrates: 0,
    fat: 0,
    proteins: 0
  };

  describe('редьюсеры', () => {
    it('должен добавлять ингредиент в конструктор', () => {
      const action = addIngredient(MOCK_INGREDIENT_1);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_1);
    });

    it('должен устанавливать булку в конструктор', () => {
      const action = setBun(MOCK_BUN);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.bun).toEqual(MOCK_BUN);
    });

    it('должен удалять ингредиент из конструктора по индексу', () => {
      // Arrange: сначала добавляем два ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(MOCK_INGREDIENT_1)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_2)
      );

      // Act: затем удаляем первый ингредиент
      const action = removeIngredient({ index: 0 });
      state = burgerConstructorSlice.reducer(state, action);

      // Assert
      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_2);
    });

    it('должен перемещать ингредиент в конструкторе: from 0 to 2', () => {
      // Arrange: добавляем три ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(MOCK_INGREDIENT_1)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_2)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_3)
      );

      // Act: перемещаем ингредиент с индекса 0 на индекс 2
      const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
      state = burgerConstructorSlice.reducer(state, action);

      // Assert: порядок должен стать [2, 3, 1]
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_2);
      expect(state.constructorItems.ingredients[1]).toEqual(MOCK_INGREDIENT_3);
      expect(state.constructorItems.ingredients[2]).toEqual(MOCK_INGREDIENT_1);
    });

    it('должен перемещать ингредиент: from 2 to 0', () => {
      // Arrange: добавляем три ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(MOCK_INGREDIENT_1)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_2)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_3)
      );

      // Act: перемещаем ингредиент с индекса 2 на индекс 0
      const action = moveIngredient({ fromIndex: 2, toIndex: 0 });
      state = burgerConstructorSlice.reducer(state, action);

      // Assert: порядок должен стать [3, 1, 2]
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_3);
      expect(state.constructorItems.ingredients[1]).toEqual(MOCK_INGREDIENT_1);
      expect(state.constructorItems.ingredients[2]).toEqual(MOCK_INGREDIENT_2);
    });

    it('должен корректно обрабатывать перемещение when fromIndex equals toIndex', () => {
      // Arrange: добавляем два ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(MOCK_INGREDIENT_1)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_2)
      );

      // Act: пытаемся переместить ингредиент с индекса 1 на индекс 1 (без изменений)
      const action = moveIngredient({ fromIndex: 1, toIndex: 1 });
      state = burgerConstructorSlice.reducer(state, action);

      // Assert: порядок не должен измениться
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_1);
      expect(state.constructorItems.ingredients[1]).toEqual(MOCK_INGREDIENT_2);
    });

    it('должен корректно обрабатывать некорректный fromIndex (отрицательный)', () => {
      // Arrange: добавляем два ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(MOCK_INGREDIENT_1)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_2)
      );

      // Act: пытаемся переместить с некорректного индекса -10 на 1
      const action = moveIngredient({ fromIndex: -10, toIndex: 1 });
      state = burgerConstructorSlice.reducer(state, action);

      // Assert: состояние не должно измениться из-за некорректного fromIndex
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_1);
      expect(state.constructorItems.ingredients[1]).toEqual(MOCK_INGREDIENT_2);
    });

    it('должен корректно обрабатывать некорректный toIndex (превышающий длину массива)', () => {
      // Arrange: добавляем два ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(MOCK_INGREDIENT_1)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_2)
      );

      // Act: пытаемся переместить с 0 на некорректный индекс 100
      const action = moveIngredient({ fromIndex: 0, toIndex: 100 });
      state = burgerConstructorSlice.reducer(state, action);

      // Assert: ингредиент должен переместиться в конец массива (на индекс 1)
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_2);
      expect(state.constructorItems.ingredients[1]).toEqual(MOCK_INGREDIENT_1);
    });
    it('должен корректно обрабатывать некорректный toIndex (превышающий длину массива)', () => {
      // Arrange: добавляем два ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(MOCK_INGREDIENT_1)
      );
      state = burgerConstructorSlice.reducer(
        state,
        addIngredient(MOCK_INGREDIENT_2)
      );

      // Act: перемещаем ингредиент с индекса 0 на индекс 100 (превышающий длину)
      const action = moveIngredient({ fromIndex: 0, toIndex: 100 });
      state = burgerConstructorSlice.reducer(state, action);

      // Assert: MOCK_INGREDIENT_1 должен переместиться в конец, MOCK_INGREDIENT_2 остаётся первым
      expect(state.constructorItems.ingredients[0]).toEqual(MOCK_INGREDIENT_2);
      expect(state.constructorItems.ingredients[1]).toEqual(MOCK_INGREDIENT_1);
    });
  });

  describe('extraReducers для fetchOrder', () => {
    it('должен устанавливать orderRequest в true при pending', () => {
      const action = { type: fetchOrder.pending.type };
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    it('должен обрабатывать fulfilled и устанавливать orderModalData', () => {
      const mockOrder = {
        _id: 'order1',
        ingredients: [],
        name: 'Test Order',
        number: 123,
        status: 'created',
        updatedAt: '',
        createdAt: ''
      };
      const action = {
        type: fetchOrder.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
      expect(state.constructorItems).toEqual({ bun: null, ingredients: [] });
    });

    it('должен обрабатывать rejected и устанавливать orderError', () => {
      const errorMessage = 'Ошибка оформления заказа';
      const action = { type: fetchOrder.rejected.type, payload: errorMessage };
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.orderError).toBe(errorMessage);
      expect(state.orderRequest).toBe(false);
    });
  });

  describe('редьюсер resetConstructor', () => {
    it('должен сбрасывать orderModalData в null', () => {
      // Arrange: создаём состояние с заполненным orderModalData
      const stateWithOrder = {
        ...initialState,
        orderModalData: {
          _id: 'order1',
          ingredients: [],
          name: 'Test Order',
          number: 123,
          status: 'created',
          updatedAt: '',
          createdAt: ''
        }
      };

      // Act
      const action = burgerConstructorSlice.actions.resetConstructor();
      const state = burgerConstructorSlice.reducer(stateWithOrder, action);

      // Assert
      expect(state.orderModalData).toBeNull();
    });
  });
});
