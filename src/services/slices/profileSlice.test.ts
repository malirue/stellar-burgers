import {
  clearError,
  getUser,
  loginUser,
  logout,
  logoutUser,
  profileSlice,
  registerUser,
  updateUser
} from './profileSlice';

describe('profileSlice', () => {
  const initialState = profileSlice.getInitialState();

  describe('редьюсеры', () => {
    it('должен выполнять logout и очищать состояние пользователя', () => {
      const stateWithUser = {
        ...initialState,
        user: { name: 'John', email: 'john@example.com' },
        isAuthenticated: true
      };
      const action = logout();
      const state = profileSlice.reducer(stateWithUser, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('должен очищать ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };
      const action = clearError();
      const state = profileSlice.reducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('extraReducers для registerUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: registerUser.pending.type };
      const state = profileSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять пользователя и устанавливать isAuthenticated в true при fulfilled', () => {
      const mockUser = { name: 'John', email: 'john@example.com' };
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = profileSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage
      };
      const state = profileSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('extraReducers для loginUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: loginUser.pending.type };
      const state = profileSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранять пользователя и устанавливать isAuthenticated в true при fulfilled', () => {
      const mockUser = { name: 'Alice', email: 'alice@example.com' };
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = profileSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка входа';
      const action = { type: loginUser.rejected.type, payload: errorMessage };
      const state = profileSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('extraReducers для logoutUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = profileSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен очищать пользователя и устанавливать isAuthenticated в false при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: { name: 'Bob', email: 'bob@example.com' },
        isAuthenticated: true
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = profileSlice.reducer(stateWithUser, action);

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const action = { type: logoutUser.rejected.type, payload: errorMessage };
      const state = profileSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('extraReducers для updateUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: updateUser.pending.type };
      const state = profileSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен устанавливать isLoading в false при fulfilled', () => {
      const action = { type: updateUser.fulfilled.type };
      const state = profileSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка обновления данных';
      const action = { type: updateUser.rejected.type, payload: errorMessage };
      const state = profileSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('extraReducers для getUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: getUser.pending.type };
      const state = profileSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сохранять пользователя и устанавливать isAuthenticated в true при fulfilled', () => {
      const mockUser = { name: 'Charlie', email: 'charlie@example.com' };
      const action = { type: getUser.fulfilled.type, payload: mockUser };
      const state = profileSlice.reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('должен сохранять ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Ошибка получения данных пользователя';
      const action = { type: getUser.rejected.type, payload: errorMessage };
      const state = profileSlice.reducer(initialState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});
