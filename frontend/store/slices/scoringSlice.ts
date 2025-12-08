import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { scoringApi } from '@/lib/api/scoring.api';
import { Score } from '@/types/scoring.types';
import { QueryOptions } from '@/types/common.types'; // Still used for history
import { Deal } from '@/types/deal.types'; // Used for comparison results

interface ScoringState {
  dealScore: Score | null; // Latest score for a specific deal
  dealScoreHistory: Score[]; // History for a specific deal
  batchJobStatus: any | null; // Status of a batch scoring job
  recalculationJobStatus: any | null; // Status of a recalculation job
  comparisonResults: { deals: { deal: Deal, score: Score }[], comparison: any } | null; // Comparison results
  loading: boolean;
  error: string | null;
}

const initialState: ScoringState = {
  dealScore: null,
  dealScoreHistory: [],
  batchJobStatus: null,
  recalculationJobStatus: null,
  comparisonResults: null,
  loading: false,
  error: null,
};

// Async Thunks for each backend scoring route
export const scoreDeal = createAsyncThunk(
  'scoring/scoreDeal',
  async ({ dealId, customWeights }: { dealId: string; customWeights?: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await scoringApi.scoreDeal(dealId, token, customWeights);
      return response.data.score;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDealScoringHistory = createAsyncThunk(
  'scoring/getDealScoringHistory',
  async ({ dealId, queryOptions }: { dealId: string; queryOptions?: QueryOptions }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await scoringApi.getDealScoringHistory(dealId, token, queryOptions);
      return response.data.history;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const batchScore = createAsyncThunk(
  'scoring/batchScore',
  async (dealIds: string[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await scoringApi.batchScore(dealIds, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBatchScoringJobStatus = createAsyncThunk(
  'scoring/getBatchScoringJobStatus',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await scoringApi.getBatchScoringJobStatus(jobId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const recalculateAllScores = createAsyncThunk(
  'scoring/recalculateAllScores',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await scoringApi.recalculateAllScores(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const compareDealScores = createAsyncThunk(
  'scoring/compareDealScores',
  async (dealIds: string[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await scoringApi.compareDealScores(dealIds, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
    }
);

const scoringSlice = createSlice({
  name: 'scoring',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // scoreDeal
      .addCase(scoreDeal.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(scoreDeal.fulfilled, (state, action: PayloadAction<Score>) => {
        state.loading = false;
        state.dealScore = action.payload;
      })
      .addCase(scoreDeal.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // getDealScoringHistory
      .addCase(getDealScoringHistory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getDealScoringHistory.fulfilled, (state, action: PayloadAction<Score[]>) => {
        state.loading = false;
        state.dealScoreHistory = action.payload;
      })
      .addCase(getDealScoringHistory.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // batchScore
      .addCase(batchScore.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(batchScore.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        state.batchJobStatus = action.payload;
      })
      .addCase(batchScore.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // getBatchScoringJobStatus
      .addCase(getBatchScoringJobStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getBatchScoringJobStatus.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        state.batchJobStatus = action.payload;
      })
      .addCase(getBatchScoringJobStatus.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // recalculateAllScores
      .addCase(recalculateAllScores.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(recalculateAllScores.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        state.recalculationJobStatus = action.payload;
      })
      .addCase(recalculateAllScores.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // compareDealScores
      .addCase(compareDealScores.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(compareDealScores.fulfilled, (state, action: PayloadAction<{ deals: { deal: Deal, score: Score }[], comparison: any }>) => {
        state.loading = false;
        state.comparisonResults = action.payload;
      })
      .addCase(compareDealScores.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectDealScore = (state: RootState) => state.scoring.dealScore;
export const selectDealScoringHistory = (state: RootState) => state.scoring.dealScoreHistory;
export const selectBatchJobStatus = (state: RootState) => state.scoring.batchJobStatus;
export const selectRecalculationJobStatus = (state: RootState) => state.scoring.recalculationJobStatus;
export const selectComparisonResults = (state: RootState) => state.scoring.comparisonResults;
export const selectScoringLoading = (state: RootState) => state.scoring.loading;
export const selectScoringError = (state: RootState) => state.scoring.error;

export default scoringSlice.reducer;
