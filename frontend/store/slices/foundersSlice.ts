import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { foundersApi } from '@/lib/api/founders.api'; // Import the API function
import { Founder } from '@/types/founder.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

interface FoundersState {
  founders: Founder[];
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

      const response: PaginatedApiResult<Founder> = await foundersApi.getAllFounders(token, queryOptions);
      return response;
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
      });
  },
});

export const selectFounders = (state: RootState) => state.founders.founders;
export const selectFoundersLoading = (state: RootState) => state.founders.loading;
export const selectFoundersError = (state: RootState) => state.founders.error;
export const selectFoundersPagination = (state: RootState) => state.founders.pagination;

export default foundersSlice.reducer;
