import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { thesisApi } from '@/lib/api/thesis.api';
import { InvestorThesis, CreateInvestorThesisPayload, UpdateInvestorThesisPayload, InvestorMatchResult } from '@/types/thesis.types';
import { QueryOptions } from '@/types/common.types';
import { Deal } from '@/types/deal.types'; // For matching deals

interface ThesisState {
  currentThesis: InvestorThesis | null; // For a single thesis being viewed/edited
  investorTheses: InvestorThesis[]; // List of theses for a specific investor
  thesisMatches: any[]; // Results from /thesis/matches/:dealId
  investorMatches: InvestorMatchResult[]; // Results from /thesis/investor/:investorId/matches
  alignmentAnalysis: any | null; // Results from /thesis/analyze
  loading: boolean;
  error: string | null;
  // No pagination for a generic 'theses' list as per backend routes
}

const initialState: ThesisState = {
  currentThesis: null,
  investorTheses: [],
  thesisMatches: [],
  investorMatches: [],
  alignmentAnalysis: null,
  loading: false,
  error: null,
};

// Async Thunks for each backend thesis route
export const createThesis = createAsyncThunk(
  'thesis/createThesis',
  async (thesisData: CreateInvestorThesisPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await thesisApi.createThesis(thesisData, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateThesis = createAsyncThunk(
  'thesis/updateThesis',
  async ({ thesisId, thesisData }: { thesisId: string; thesisData: UpdateInvestorThesisPayload }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await thesisApi.updateThesis(thesisId, thesisData, token);
      return response.data;
    }  catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getThesisMatches = createAsyncThunk(
  'thesis/getThesisMatches',
  async (dealId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await thesisApi.getThesisMatches(dealId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getInvestorMatches = createAsyncThunk(
  'thesis/getInvestorMatches',
  async ({ investorId, queryOptions }: { investorId: string; queryOptions?: QueryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await thesisApi.getInvestorMatches(investorId, token, queryOptions);
      return response.results; // Assuming PaginatedApiResult
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getInvestorTheses = createAsyncThunk(
  'thesis/getInvestorTheses',
  async ({ investorId, queryOptions }: { investorId: string; queryOptions?: QueryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await thesisApi.getInvestorTheses(investorId, token, queryOptions);
      return response.results; // Assuming PaginatedApiResult
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const analyzeAlignment = createAsyncThunk(
  'thesis/analyzeAlignment',
  async (payload: { thesisId: string; dealId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await thesisApi.analyzeAlignment(payload, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deactivateThesis = createAsyncThunk(
  'thesis/deactivateThesis',
  async (thesisId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      await thesisApi.deactivateThesis(thesisId, token);
      return thesisId; // Return ID of deactivated thesis
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const thesisSlice = createSlice({
  name: 'thesis',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createThesis
      .addCase(createThesis.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createThesis.fulfilled, (state, action: PayloadAction<InvestorThesis>) => {
        state.loading = false;
        state.currentThesis = action.payload;
        // Also add to investorTheses if applicable, or refetch
      })
      .addCase(createThesis.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // updateThesis
      .addCase(updateThesis.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateThesis.fulfilled, (state, action: PayloadAction<InvestorThesis>) => {
        state.loading = false;
        state.currentThesis = action.payload;
        // Update in investorTheses array if present
      })
      .addCase(updateThesis.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // getThesisMatches
      .addCase(getThesisMatches.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getThesisMatches.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.thesisMatches = action.payload;
      })
      .addCase(getThesisMatches.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // getInvestorMatches
      .addCase(getInvestorMatches.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getInvestorMatches.fulfilled, (state, action: PayloadAction<InvestorMatchResult[]>) => {
        state.loading = false;
        state.investorMatches = action.payload;
      })
      .addCase(getInvestorMatches.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // getInvestorTheses
      .addCase(getInvestorTheses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getInvestorTheses.fulfilled, (state, action: PayloadAction<InvestorThesis[]>) => {
        state.loading = false;
        state.investorTheses = action.payload;
      })
      .addCase(getInvestorTheses.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // analyzeAlignment
      .addCase(analyzeAlignment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(analyzeAlignment.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.alignmentAnalysis = action.payload;
      })
      .addCase(analyzeAlignment.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // deactivateThesis
      .addCase(deactivateThesis.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deactivateThesis.fulfilled, (state, action: PayloadAction<string>) => { // action.payload is thesisId
        state.loading = false;
        state.investorTheses = state.investorTheses.filter(thesis => thesis.id !== action.payload);
        if (state.currentThesis?.id === action.payload) {
          state.currentThesis = null;
        }
      })
      .addCase(deactivateThesis.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectCurrentThesis = (state: RootState) => state.thesis.currentThesis;
export const selectInvestorTheses = (state: RootState) => state.thesis.investorTheses;
export const selectThesisMatches = (state: RootState) => state.thesis.thesisMatches;
export const selectInvestorMatches = (state: RootState) => state.thesis.investorMatches;
export const selectAlignmentAnalysis = (state: RootState) => state.thesis.alignmentAnalysis;
export const selectThesisLoading = (state: RootState) => state.thesis.loading;
export const selectThesisError = (state: RootState) => state.thesis.error;

export default thesisSlice.reducer;
