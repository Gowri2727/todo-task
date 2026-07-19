import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Task, TaskState } from '../types';
import { RootState } from './store';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/tasks`;

const getHeaders = (state: RootState) => {
  const token = state.auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: 'All',
  searchQuery: '',
  sortBy: 'dynamic',
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axios.get(API_URL, getHeaders(state));
      if (response.data.success) {
        return response.data.data;
      }
      return thunkAPI.rejectWithValue('Failed to fetch tasks');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axios.post(API_URL, taskData, getHeaders(state));
      if (response.data.success) {
        return response.data.data;
      }
      return thunkAPI.rejectWithValue('Failed to create task');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }: { id: string; taskData: Partial<Task> }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axios.put(`${API_URL}/${id}`, taskData, getHeaders(state));
      if (response.data.success) {
        return response.data.data;
      }
      return thunkAPI.rejectWithValue('Failed to update task');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axios.delete(`${API_URL}/${id}`, getHeaders(state));
      if (response.data.success) {
        return id;
      }
      return thunkAPI.rejectWithValue('Failed to delete task');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  'tasks/toggleTaskCompletion',
  async ({ id, completed }: { id: string; completed: boolean }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const response = await axios.patch(`${API_URL}/${id}/complete`, { completed: !completed }, getHeaders(state));
      if (response.data.success) {
        return response.data.data;
      }
      return thunkAPI.rejectWithValue('Failed to toggle completion');
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to toggle completion');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      // Toggle Task Completion
      .addCase(toggleTaskCompletion.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export const { setFilter, setSearchQuery, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
