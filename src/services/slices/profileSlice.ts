import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '@utils';

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

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUserApi(credentials);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка входа');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.setItem('refreshToken', '');
      return;
    } catch (error) {
      return rejectWithValue('Ошибка выхода');
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue('Ошибка получения данных пользователя');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateUserApi(userData);
      await dispatch(getUser());
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка обновления данных');
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
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, clearError } = profileSlice.actions;
export default profileSlice.reducer;
