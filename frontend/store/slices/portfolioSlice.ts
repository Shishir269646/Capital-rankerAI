import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { portfolioApi } from '@/lib/api/portfolio.api'; // Import the API function
import { Portfolio, CreatePortfolioPayload, UpdatePortfolioPayload } from '@/types/portfolio.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

interface PortfolioState {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null; // For a single portfolio being viewed/edited
  portfolioPerformance: any | null;
  portfolioAnalytics: any | null;
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
  currentPortfolio: null,
  portfolioPerformance: null,
  portfolioAnalytics: null,
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

      const response: PaginatedApiResult<Portfolio> = await portfolioApi.getAllPortfolios(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get portfolio by ID
export const fetchPortfolioById = createAsyncThunk(
  'portfolio/fetchPortfolioById',
  async (portfolioId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: portfolioApi.getPortfolioById currently has no corresponding backend route.
      const response = await portfolioApi.getPortfolioById(portfolioId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Create portfolio
export const createPortfolio = createAsyncThunk(
  'portfolio/createPortfolio',
  async (portfolioData: CreatePortfolioPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: portfolioApi.createPortfolio currently has no corresponding backend route.
      const response = await portfolioApi.createPortfolio(portfolioData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Update portfolio
export const updatePortfolio = createAsyncThunk(
  'portfolio/updatePortfolio',
  async ({ portfolioId, portfolioData }: { portfolioId: string; portfolioData: UpdatePortfolioPayload }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: portfolioApi.updatePortfolio currently has no corresponding backend route.
      const response = await portfolioApi.updatePortfolio(portfolioId, portfolioData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Delete portfolio
export const deletePortfolio = createAsyncThunk(
  'portfolio/deletePortfolio',
  async (portfolioId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: portfolioApi.deletePortfolio currently has no corresponding backend route.
      await portfolioApi.deletePortfolio(portfolioId, token);
      return portfolioId; // Return ID of deleted portfolio
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get portfolio performance
export const fetchPortfolioPerformance = createAsyncThunk(
  'portfolio/fetchPortfolioPerformance',
  async ({ portfolioId, queryOptions }: { portfolioId: string; queryOptions?: QueryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: portfolioApi.getPortfolioPerformance has a functional mismatch with backend route.
      // The frontend client method might be trying to get overall performance,
      // but the backend route GET /api/v1/portfolio/:id/performance expects an ID in params for a specific item.
      const response = await portfolioApi.getPortfolioPerformance(token, queryOptions); // Frontend method signature might need adjustment
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get portfolio analytics
export const fetchPortfolioAnalytics = createAsyncThunk(
  'portfolio/fetchPortfolioAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await portfolioApi.getAnalytics(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Update portfolio metrics
export const updatePortfolioMetrics = createAsyncThunk(
  'portfolio/updatePortfolioMetrics',
  async ({ portfolioId, metricsData }: { portfolioId: string; metricsData: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await portfolioApi.updateMetrics(portfolioId, metricsData, token);
      return response.data;
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
      // fetchPortfolios
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Portfolio>>) => {
        state.loading = false;
        state.portfolios = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPortfolios.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchPortfolioById
      .addCase(fetchPortfolioById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPortfolioById.fulfilled, (state, action: PayloadAction<Portfolio>) => {
        state.loading = false;
        state.currentPortfolio = action.payload;
      })
      .addCase(fetchPortfolioById.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // createPortfolio
      .addCase(createPortfolio.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPortfolio.fulfilled, (state, action: PayloadAction<Portfolio>) => {
        state.loading = false;
        state.currentPortfolio = action.payload;
        state.portfolios.unshift(action.payload); // Add to beginning of list
      })
      .addCase(createPortfolio.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // updatePortfolio
      .addCase(updatePortfolio.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePortfolio.fulfilled, (state, action: PayloadAction<Portfolio>) => {
        state.loading = false;
        state.currentPortfolio = action.payload;
        const index = state.portfolios.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.portfolios[index] = action.payload;
        }
      })
      .addCase(updatePortfolio.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // deletePortfolio
      .addCase(deletePortfolio.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deletePortfolio.fulfilled, (state, action: PayloadAction<string>) => { // action.payload is portfolioId
        state.loading = false;
        state.portfolios = state.portfolios.filter(p => p.id !== action.payload);
        if (state.currentPortfolio?.id === action.payload) {
          state.currentPortfolio = null;
        }
      })
      .addCase(deletePortfolio.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // fetchPortfolioPerformance
      .addCase(fetchPortfolioPerformance.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPortfolioPerformance.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        state.portfolioPerformance = action.payload;
      })
      .addCase(fetchPortfolioPerformance.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // fetchPortfolioAnalytics
      .addCase(fetchPortfolioAnalytics.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPortfolioAnalytics.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        state.portfolioAnalytics = action.payload;
      })
      .addCase(fetchPortfolioAnalytics.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // updatePortfolioMetrics
      .addCase(updatePortfolioMetrics.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePortfolioMetrics.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        // Logic to update currentPortfolio or relevant portfolio in list
      })
      .addCase(updatePortfolioMetrics.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectPortfolios = (state: RootState) => state.portfolio.portfolios;
export const selectCurrentPortfolio = (state: RootState) => state.portfolio.currentPortfolio;
export const selectPortfolioPerformance = (state: RootState) => state.portfolio.portfolioPerformance;
export const selectPortfolioAnalytics = (state: RootState) => state.portfolio.portfolioAnalytics;
export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;
export const selectPortfolioError = (state: RootState) => state.portfolio.error;
export const selectPortfolioPagination = (state: RootState) => state.portfolio.pagination;

export default portfolioSlice.reducer;