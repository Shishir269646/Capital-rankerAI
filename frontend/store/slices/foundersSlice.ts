import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { foundersApi } from '@/lib/api/founders.api';
import { Founder, CreateFounderPayload, UpdateFounderPayload } from '@/types/founder.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

interface FoundersState {
  founders: Founder[];
  currentFounder: Founder | null; // For a single founder being viewed/edited
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

const initialState: FoundersState = {
  founders: [],
  currentFounder: null,
  loading: false,
  error: null,
};

export const fetchFounders = createAsyncThunk(
  'founders/fetchFounders',
  async (queryOptions: QueryOptions | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }

      // WARNING: foundersApi.getAllFounders currently has no corresponding backend route.
      const response: PaginatedApiResult<Founder> = await foundersApi.getAllFounders(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get founder by ID
export const fetchFounderById = createAsyncThunk(
  'founders/fetchFounderById',
  async (founderId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await foundersApi.getFounderById(founderId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Create founder
export const createFounder = createAsyncThunk(
  'founders/createFounder',
  async (founderData: CreateFounderPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: foundersApi.createFounder currently has no corresponding backend route.
      const response = await foundersApi.createFounder(founderData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Update founder
export const updateFounder = createAsyncThunk(
  'founders/updateFounder',
  async ({ founderId, founderData }: { founderId: string; founderData: UpdateFounderPayload }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await foundersApi.updateFounder(founderId, founderData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Delete founder
export const deleteFounder = createAsyncThunk(
  'founders/deleteFounder',
  async (founderId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: foundersApi.deleteFounder currently has no corresponding backend route.
      await foundersApi.deleteFounder(founderId, token);
      return founderId; // Return ID of deleted founder
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Evaluate founder
export const evaluateFounder = createAsyncThunk(
  'founders/evaluateFounder',
  async (founderId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await foundersApi.evaluateFounder(founderId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get founders by startup
export const fetchFoundersByStartup = createAsyncThunk(
  'founders/fetchFoundersByStartup',
  async (startupId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response: PaginatedApiResult<Founder[]> = await foundersApi.getFoundersByStartup(startupId, token);
      return response.results;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const foundersSlice = createSlice({
  name: 'founders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFounders
      .addCase(fetchFounders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFounders.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Founder>>) => {
        state.loading = false;
        state.founders = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFounders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchFounderById
      .addCase(fetchFounderById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFounderById.fulfilled, (state, action: PayloadAction<Founder>) => {
        state.loading = false;
        state.currentFounder = action.payload;
      })
      .addCase(fetchFounderById.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // createFounder
      .addCase(createFounder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createFounder.fulfilled, (state, action: PayloadAction<Founder>) => {
        state.loading = false;
        state.currentFounder = action.payload;
        state.founders.unshift(action.payload); // Add to beginning of list
      })
      .addCase(createFounder.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // updateFounder
      .addCase(updateFounder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateFounder.fulfilled, (state, action: PayloadAction<Founder>) => {
        state.loading = false;
        state.currentFounder = action.payload;
        const index = state.founders.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.founders[index] = action.payload;
        }
      })
      .addCase(updateFounder.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // deleteFounder
      .addCase(deleteFounder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteFounder.fulfilled, (state, action: PayloadAction<string>) => { // action.payload is founderId
        state.loading = false;
        state.founders = state.founders.filter(f => f.id !== action.payload);
        if (state.currentFounder?.id === action.payload) {
          state.currentFounder = null;
        }
      })
      .addCase(deleteFounder.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // evaluateFounder
      .addCase(evaluateFounder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(evaluateFounder.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        // Logic to update currentFounder or relevant founder in list
      })
      .addCase(evaluateFounder.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // fetchFoundersByStartup
      .addCase(fetchFoundersByStartup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFoundersByStartup.fulfilled, (state, action: PayloadAction<Founder[]>) => {
        state.loading = false;
        // This might not update 'founders' directly, but perhaps a separate state for startup-specific founders
      })
      .addCase(fetchFoundersByStartup.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectFounders = (state: RootState) => state.founders.founders;
export const selectCurrentFounder = (state: RootState) => state.founders.currentFounder;
export const selectFoundersLoading = (state: RootState) => state.founders.loading;
export const selectFoundersError = (state: RootState) => state.founders.error;
export const selectFoundersPagination = (state: RootState) => state.founders.pagination;

export default foundersSlice.reducer;