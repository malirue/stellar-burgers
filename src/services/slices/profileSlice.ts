import { loginUserApi, logoutApi, registerUserApi, TRegisterData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(userData);
    } catch (error) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

// Thunk для входа
export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await loginUserApi(credentials);
    } catch (error) {
      return rejectWithValue('Ошибка входа');
    }
  }
);

interface AuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const profileSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      });
    //   .addCase(logoutApi.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(logoutApi.fulfilled, (state) => {
    //     state.user = null;
    //     state.isAuthenticated = false;
    //     state.isLoading = false;
    //   });
  }
});

export const { logout, clearError } = profileSlice.actions;
export default profileSlice.reducer;
