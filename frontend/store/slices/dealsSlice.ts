// ======= updated deals slice: src/store/slices/deals.slice.ts =======
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from '../index';
import { dealsApi } from '@/lib/api/deals.api';
import type { Deal, CreateDealPayload, UpdateDealPayload } from '@/types/deal.types';
import type { QueryOptions } from '@/types/common.types';
import type { PaginatedApiResult } from '@/types/api.types';

interface DealsState {
  deals: Deal[];
  currentDeal: Deal | null;
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

// ----------------------------------
// Thunks (with basic dedupe via condition)
// ----------------------------------
export const fetchDeals = createAsyncThunk<
  PaginatedApiResult<Deal>,
  QueryOptions | undefined,
  { state: RootState; rejectValue: string }
>(
  'deals/fetchDeals',
  async (queryOptions, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');

      const response: PaginatedApiResult<Deal> = await dealsApi.getAllDeals(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  },
  {
    // if there's already a fetch in progress, skip new one
    condition: (queryOptions, { getState }) => {
      const state = getState() as RootState;
      if (state.deals.loading) return false;
      return true;
    },
  }
);

export const fetchDealById = createAsyncThunk<Deal, string, { state: RootState; rejectValue: string }>(
  'deals/fetchDealById',
  async (dealId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.getDealById(dealId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  },
  {
    condition: (dealId, { getState }) => {
      const state = getState() as RootState;
      // if currently loaded deal is same id and not loading, skip
      if (state.deals.currentDeal?.id === dealId && !state.deals.loading) return false;
      return true;
    },
  }
);

export const createDeal = createAsyncThunk<Deal, CreateDealPayload, { state: RootState; rejectValue: string }>(
  'deals/createDeal',
  async (dealData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.createDeal(dealData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const updateDeal = createAsyncThunk<Deal, { dealId: string; dealData: UpdateDealPayload }, { state: RootState; rejectValue: string }>(
  'deals/updateDeal',
  async ({ dealId, dealData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.updateDeal(dealId, dealData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const deleteDeal = createAsyncThunk<string, string, { state: RootState; rejectValue: string }>(
  'deals/deleteDeal',
  async (dealId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      await dealsApi.deleteDeal(dealId, token);
      return dealId;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const searchDeals = createAsyncThunk<PaginatedApiResult<Deal>, any, { state: RootState; rejectValue: string }>(
  'deals/searchDeals',
  async (searchPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.searchDeals(searchPayload, token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const bulkImportDeals = createAsyncThunk<any, FormData, { state: RootState; rejectValue: string }>(
  'deals/bulkImportDeals',
  async (file, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.bulkImportDeals(file, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const getDealStats = createAsyncThunk<any, void, { state: RootState; rejectValue: string }>(
  'deals/getDealStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.getDealStats(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const getTopRankedDeals = createAsyncThunk<Deal[], QueryOptions | undefined, { state: RootState; rejectValue: string }>(
  'deals/getTopRankedDeals',
  async (queryOptions, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response: PaginatedApiResult<Deal> = await dealsApi.getTopRankedDeals(token, queryOptions);
      return response.results;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const exportDeals = createAsyncThunk<Blob, { format: 'csv' | 'xlsx'; queryOptions?: QueryOptions }, { state: RootState; rejectValue: string }>(
  'deals/exportDeals',
  async ({ format, queryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const blob = await dealsApi.exportDeals(token, format, queryOptions);
      return blob;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const getSimilarDeals = createAsyncThunk<Deal[], { dealId: string; queryOptions?: QueryOptions }, { state: RootState; rejectValue: string }>(
  'deals/getSimilarDeals',
  async ({ dealId, queryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response: PaginatedApiResult<Deal> = await dealsApi.getSimilarDeals(dealId, token, queryOptions);
      return response.results;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

export const addDealNote = createAsyncThunk<any, { dealId: string; noteContent: string }, { state: RootState; rejectValue: string }>(
  'deals/addDealNote',
  async ({ dealId, noteContent }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await dealsApi.addDealNote(dealId, noteContent, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? 'Unknown error');
    }
  }
);

// ----------------------------------
// Slice
// ----------------------------------
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
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to fetch deals';
      })

      .addCase(fetchDealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealById.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.currentDeal = action.payload;
      })
      .addCase(fetchDealById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to fetch deal';
      })

      .addCase(createDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.currentDeal = action.payload;
        state.deals.unshift(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to create deal';
      })

      .addCase(updateDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.loading = false;
        state.currentDeal = action.payload;
        const index = state.deals.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.deals[index] = action.payload;
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to update deal';
      })

      .addCase(deleteDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.deals = state.deals.filter((d) => d.id !== action.payload);
        if (state.currentDeal?.id === action.payload) state.currentDeal = null;
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to delete deal';
      })

      .addCase(searchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDeals.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Deal>>) => {
        state.loading = false;
        state.deals = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Search failed';
      })

      .addCase(bulkImportDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkImportDeals.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bulkImportDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Bulk import failed';
      })

      .addCase(getDealStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDealStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.dealStats = action.payload;
      })
      .addCase(getDealStats.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to load stats';
      })

      .addCase(getTopRankedDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopRankedDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.loading = false;
        state.topRankedDeals = action.payload;
      })
      .addCase(getTopRankedDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to load top deals';
      })

      .addCase(exportDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportDeals.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Export failed';
      })

      .addCase(getSimilarDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSimilarDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.loading = false;
        state.similarDeals = action.payload;
      })
      .addCase(getSimilarDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to load similar deals';
      })

      .addCase(addDealNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDealNote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addDealNote.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error?.message ?? 'Failed to add note';
      });
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

