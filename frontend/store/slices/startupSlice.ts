import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { startupApi } from '@/lib/api/startup.api';
import { Startup, CreateStartupPayload, UpdateStartupPayload } from '@/types/startup.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

interface StartupsState {
  startups: Startup[];
  currentStartup: Startup | null;
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

const initialState: StartupsState = {
  startups: [],
  currentStartup: null,
  loading: false,
  error: null,
};

export const fetchStartups = createAsyncThunk(
  'startups/fetchStartups',
  async (queryOptions: QueryOptions | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }

      const response: PaginatedApiResult<Startup> = await startupApi.getAllStartups(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStartupById = createAsyncThunk(
  'startups/fetchStartupById',
  async (startupId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await startupApi.getStartupById(startupId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createStartup = createAsyncThunk(
  'startups/createStartup',
  async (startupData: CreateStartupPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await startupApi.createStartup(startupData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStartup = createAsyncThunk(
  'startups/updateStartup',
  async ({ startupId, startupData }: { startupId: string; startupData: UpdateStartupPayload }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await startupApi.updateStartup(startupId, startupData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStartup = createAsyncThunk(
  'startups/deleteStartup',
  async (startupId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      await startupApi.deleteStartup(startupId, token);
      return startupId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const startupSlice = createSlice({
  name: 'startups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStartups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStartups.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Startup>>) => {
        state.loading = false;
        state.startups = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStartups.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStartupById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStartupById.fulfilled, (state, action: PayloadAction<Startup>) => {
        state.loading = false;
        state.currentStartup = action.payload;
      })
      .addCase(fetchStartupById.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      .addCase(createStartup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createStartup.fulfilled, (state, action: PayloadAction<Startup>) => {
        state.loading = false;
        state.currentStartup = action.payload;
        state.startups.unshift(action.payload);
      })
      .addCase(createStartup.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      .addCase(updateStartup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateStartup.fulfilled, (state, action: PayloadAction<Startup>) => {
        state.loading = false;
        state.currentStartup = action.payload;
        const index = state.startups.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.startups[index] = action.payload;
        }
      })
      .addCase(updateStartup.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteStartup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteStartup.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.startups = state.startups.filter(s => s.id !== action.payload);
        if (state.currentStartup?.id === action.payload) {
          state.currentStartup = null;
        }
      })
      .addCase(deleteStartup.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectStartups = (state: RootState) => state.startups.startups;
export const selectCurrentStartup = (state: RootState) => state.startups.currentStartup;
export const selectStartupsLoading = (state: RootState) => state.startups.loading;
export const selectStartupsError = (state: RootState) => state.startups.error;
export const selectStartupsPagination = (state: RootState) => state.startups.pagination;

export default startupSlice.reducer;
