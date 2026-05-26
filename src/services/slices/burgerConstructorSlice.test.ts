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

  describe('редьюсеры', () => {
    it('должен добавлять ингредиент в конструктор', () => {
      const ingredient = {
        _id: '1',
        name: 'Котлета',
        type: 'main',
        price: 100,
        image: '',
        image_mobile: '',
        calories: 0,
        carbohydrates: 0,
        fat: 0,
        proteins: 0
      };
      const action = addIngredient(ingredient);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(ingredient);
    });

    it('должен устанавливать булку в конструктор', () => {
      const bun = {
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
      const action = setBun(bun);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.bun).toEqual(bun);
    });

    it('должен удалять ингредиент из конструктора по индексу', () => {
      const ingredient1 = {
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
      const ingredient2 = {
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

      // Сначала добавляем два ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );
      state = burgerConstructorSlice.reducer(state, addIngredient(ingredient2));

      // Затем удаляем первый ингредиент
      const action = removeIngredient({ index: 0 });
      state = burgerConstructorSlice.reducer(state, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(ingredient2);
    });

    it('должен перемещать ингредиент в конструкторе', () => {
      const ingredient1 = {
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
      const ingredient2 = {
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
      const ingredient3 = {
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

      // Добавляем три ингредиента
      let state = burgerConstructorSlice.reducer(
        initialState,
        addIngredient(ingredient1)
      );
      state = burgerConstructorSlice.reducer(state, addIngredient(ingredient2));
      state = burgerConstructorSlice.reducer(state, addIngredient(ingredient3));

      // Перемещаем ингредиент с индекса 0 на индекс 2
      const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
      state = burgerConstructorSlice.reducer(state, action);

      expect(state.constructorItems.ingredients[0]).toEqual(ingredient2);
      expect(state.constructorItems.ingredients[1]).toEqual(ingredient3);
      expect(state.constructorItems.ingredients[2]).toEqual(ingredient1);
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
});
