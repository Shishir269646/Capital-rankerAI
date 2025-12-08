import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { portfolioApi } from '@/lib/api/portfolio.api'; // Import the API function
import { Portfolio } from '@/types/portfolio.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

interface PortfolioState {
  portfolios: Portfolio[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

const initialState: PortfolioState = {
  portfolios: [],
  loading: false,
  error: null,
};

export const fetchPortfolios = createAsyncThunk(
  'portfolio/fetchPortfolios',
  async (queryOptions: QueryOptions | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }

      const response: PaginatedApiResult<Portfolio[]> = await portfolioApi.getAllPortfolios(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Portfolio[]>>) => {
        state.loading = false;
        state.portfolios = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPortfolios.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectPortfolios = (state: RootState) => state.portfolio.portfolios;
export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;
export const selectPortfolioError = (state: RootState) => state.portfolio.error;
export const selectPortfolioPagination = (state: RootState) => state.portfolio.pagination;

export default portfolioSlice.reducer;
