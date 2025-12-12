import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { reportsApi } from '@/lib/api/reports.api';
import { Report, GenerateReportPayload } from '@/types/report.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types'; // Used for getAllReports

interface ReportsState {
  generatedReports: Report[]; // Stores metadata for generated reports
  dealReport: any | null; // The deal-specific report data (type needs refinement)
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  } | null;
}

const initialState: ReportsState = {
  generatedReports: [],
  dealReport: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async Thunks for each backend report route
export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (payload: GenerateReportPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await reportsApi.requestReportGeneration(payload, token);
      return response.data; // Should return the Report metadata
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Get all reports (WARNING: No corresponding backend route yet)
export const fetchAllReports = createAsyncThunk(
  'reports/fetchAllReports',
  async (queryOptions: QueryOptions | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      // WARNING: reportsApi.getAllReports currently has no corresponding backend route.
      const response: PaginatedApiResult<Report> = await reportsApi.getAllReports(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Note: downloadReport thunk will likely not update state directly,
// but rather trigger a file download. We will still track its loading/error.
export const downloadReport = createAsyncThunk(
  'reports/downloadReport',
  async ({ reportId, format }: { reportId: string, format: 'pdf' | 'csv' | 'xlsx' }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const blob = await reportsApi.downloadReport(reportId, token);

      // Trigger download in browser
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.${format}`; // Filename based on reportId and format
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return { reportId, status: 'downloaded' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDealReport = createAsyncThunk(
  'reports/getDealReport',
  async (dealId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await reportsApi.getDealReport(dealId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // generateReport
      .addCase(generateReport.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(generateReport.fulfilled, (state, action: PayloadAction<Report>) => {
        state.loading = false;
        state.generatedReports.push(action.payload); // Add new report metadata
      })
      .addCase(generateReport.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // fetchAllReports
      .addCase(fetchAllReports.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllReports.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Report>>) => {
        state.loading = false;
        state.generatedReports = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllReports.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // downloadReport
      .addCase(downloadReport.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(downloadReport.fulfilled, (state, action: PayloadAction<any>) => { // action.payload will be { reportId, status: 'downloaded' }
        state.loading = false;
        // No direct state update needed for content, only loading/error status
      })
      .addCase(downloadReport.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // getDealReport
      .addCase(getDealReport.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getDealReport.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.dealReport = action.payload;
      })
      .addCase(getDealReport.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectGeneratedReports = (state: RootState) => state.reports.generatedReports;
export const selectDealReport = (state: RootState) => state.reports.dealReport;
export const selectReportsLoading = (state: RootState) => state.reports.loading;
export const selectReportsError = (state: RootState) => state.reports.error;
export const selectReportsPagination = (state: RootState) => state.reports.pagination;

export default reportsSlice.reducer;