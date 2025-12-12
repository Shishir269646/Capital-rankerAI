import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { dealsApi } from '@/lib/api/deals.api'; // Import the API function
import { Deal, CreateDealPayload, UpdateDealPayload } from '@/types/deal.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

interface DealsState {
  deals: Deal[];
  currentDeal: Deal | null; // For a single deal being viewed/edited
  dealStats: any | null;
  topRankedDeals: Deal[];
  similarDeals: Deal[];
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
  currentDeal: null,
  dealStats: null,
  topRankedDeals: [],
  similarDeals: [],
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

// New Thunk: Get deal by ID
export const fetchDealById = createAsyncThunk(
  'deals/fetchDealById',
  async (dealId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.getDealById(dealId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Create a deal
export const createDeal = createAsyncThunk(
  'deals/createDeal',
  async (dealData: CreateDealPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.createDeal(dealData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Update a deal
export const updateDeal = createAsyncThunk(
  'deals/updateDeal',
  async ({ dealId, dealData }: { dealId: string; dealData: UpdateDealPayload }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.updateDeal(dealId, dealData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Delete a deal
export const deleteDeal = createAsyncThunk(
  'deals/deleteDeal',
  async (dealId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      await dealsApi.deleteDeal(dealId, token);
      return dealId; // Return ID of deleted deal
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Search deals
export const searchDeals = createAsyncThunk(
  'deals/searchDeals',
  async (searchPayload: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.searchDeals(searchPayload, token);
      return response; // Assuming PaginatedApiResult
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Bulk import deals
export const bulkImportDeals = createAsyncThunk(
  'deals/bulkImportDeals',
  async (file: FormData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.bulkImportDeals(file, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get deal stats
export const getDealStats = createAsyncThunk(
  'deals/getDealStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.getDealStats(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get top ranked deals
export const getTopRankedDeals = createAsyncThunk(
  'deals/getTopRankedDeals',
  async (queryOptions: QueryOptions | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response: PaginatedApiResult<Deal> = await dealsApi.getTopRankedDeals(token, queryOptions);
      return response.results;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Export deals
export const exportDeals = createAsyncThunk(
  'deals/exportDeals',
  async ({ format, queryOptions }: { format: 'csv' | 'xlsx'; queryOptions?: QueryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const blob = await dealsApi.exportDeals(token, format, queryOptions);
      return blob; // Return the blob for client-side download
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get similar deals
export const getSimilarDeals = createAsyncThunk(
  'deals/getSimilarDeals',
  async ({ dealId, queryOptions }: { dealId: string; queryOptions?: QueryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response: PaginatedApiResult<Deal> = await dealsApi.getSimilarDeals(dealId, token, queryOptions);
      return response.results;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Add deal note
export const addDealNote = createAsyncThunk(
  'deals/addDealNote',
  async ({ dealId, noteContent }: { dealId: string; noteContent: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.addDealNote(dealId, noteContent, token); // dealsApi.addDealNote expects content directly
      return response.data;
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
      // fetchDeals
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
      })
      // fetchDealById
      .addCase(fetchDealById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDealById.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.currentDeal = action.payload;
      })
      .addCase(fetchDealById.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // createDeal
      .addCase(createDeal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.currentDeal = action.payload; // Set current deal to newly created
        state.deals.unshift(action.payload); // Add to beginning of deals list
      })
      .addCase(createDeal.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // updateDeal
      .addCase(updateDeal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.currentDeal = action.payload; // Update current deal
        const index = state.deals.findIndex(deal => deal.id === action.payload.id);
        if (index !== -1) {
          state.deals[index] = action.payload; // Update in deals list
        }
      })
      .addCase(updateDeal.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // deleteDeal
      .addCase(deleteDeal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteDeal.fulfilled, (state, action: PayloadAction<string>) => { // action.payload is dealId
        state.loading = false;
        state.deals = state.deals.filter(deal => deal.id !== action.payload); // Remove from deals list
        if (state.currentDeal?.id === action.payload) {
          state.currentDeal = null; // Clear if deleted
        }
      })
      .addCase(deleteDeal.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // searchDeals
      .addCase(searchDeals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchDeals.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Deal>>) => {
        state.loading = false;
        state.deals = action.payload.results; // Overwrite deals with search results
        state.pagination = action.payload.pagination;
      })
      .addCase(searchDeals.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // bulkImportDeals
      .addCase(bulkImportDeals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(bulkImportDeals.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        // Optionally, trigger a refetch of deals or add new deals to state
      })
      .addCase(bulkImportDeals.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // getDealStats
      .addCase(getDealStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getDealStats.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        state.dealStats = action.payload;
      })
      .addCase(getDealStats.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // getTopRankedDeals
      .addCase(getTopRankedDeals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getTopRankedDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.loading = false;
        state.topRankedDeals = action.payload;
      })
      .addCase(getTopRankedDeals.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // exportDeals - no state update on fulfill as it's a direct download
      .addCase(exportDeals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(exportDeals.fulfilled, (state) => { state.loading = false; })
      .addCase(exportDeals.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // getSimilarDeals
      .addCase(getSimilarDeals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getSimilarDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.loading = false;
        state.similarDeals = action.payload;
      })
      .addCase(getSimilarDeals.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })
      // addDealNote
      .addCase(addDealNote.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addDealNote.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific, assuming updated deal or note
        state.loading = false;
        // Logic to add note to currentDeal or re-fetch currentDeal
      })
      .addCase(addDealNote.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectDeals = (state: RootState) => state.deals.deals;
export const selectCurrentDeal = (state: RootState) => state.deals.currentDeal;
export const selectDealStats = (state: RootState) => state.deals.dealStats;
export const selectTopRankedDeals = (state: RootState) => state.deals.topRankedDeals;
export const selectSimilarDeals = (state: RootState) => state.deals.similarDeals;
export const selectDealsLoading = (state: RootState) => state.deals.loading;
export const selectDealsError = (state: RootState) => state.deals.error;
export const selectDealsPagination = (state: RootState) => state.deals.pagination;

export default dealsSlice.reducer;