import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '../types';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/auth`;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.data.token);
        return response.data.data;
      }
      return thunkAPI.rejectWithValue(response.data.message || 'Registration failed');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData: any, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.data.token);
        return response.data.data;
      }
      return thunkAPI.rejectWithValue(response.data.message || 'Login failed');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Login failed'
      );
    }
  }
);

export const checkAutoLogin = createAsyncThunk(
  'auth/checkAutoLogin',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return thunkAPI.rejectWithValue('No token found');

      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        return { user: response.data.data, token };
      }
      return thunkAPI.rejectWithValue('Session expired');
    } catch (error: any) {
      await AsyncStorage.removeItem('token');
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Session expired or network error'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Auto-login
      .addCase(checkAutoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAutoLogin.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAutoLogin.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
