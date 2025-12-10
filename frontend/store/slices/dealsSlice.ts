import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { dealsApi } from '@/lib/api/deals.api'; // Import the API function
import { Deal } from '@/types/deal.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

interface DealsState {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

const initialState: DealsState = {
  deals: [],
  loading: false,
  error: null,
};

export const fetchDeals = createAsyncThunk(
  'deals/fetchDeals',
  async (queryOptions: QueryOptions | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }

      const response: PaginatedApiResult<Deal> = await dealsApi.getAllDeals(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Deal>>) => {
        state.loading = false;
        state.deals = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDeals.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectDeals = (state: RootState) => state.deals.deals;
export const selectDealsLoading = (state: RootState) => state.deals.loading;
export const selectDealsError = (state: RootState) => state.deals.error;
export const selectDealsPagination = (state: RootState) => state.deals.pagination;

export default dealsSlice.reducer;

