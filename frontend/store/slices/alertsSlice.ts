import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { alertsApi } from '@/lib/api/alerts.api';
import { Alert } from '@/types/alert.types';
import { QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types'; // Used for getAllAlerts

interface AlertsState {
  currentAlerts: Alert[]; // Alerts retrieved by getAllAlerts
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  currentAlerts: [],
  pagination: null,
  loading: false,
  error: null,
};

// Async Thunks for each backend alert route
export const getAllAlerts = createAsyncThunk(
  'alerts/getAllAlerts',
  async (queryOptions: QueryOptions | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response: PaginatedApiResult<Alert[]> = await alertsApi.getAllAlerts(token, queryOptions);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const configureAlerts = createAsyncThunk(
  'alerts/configureAlerts',
  async (payload: any, { getState, rejectWithValue }) => { // Payload type needs to be defined
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await alertsApi.configureAlerts(payload, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'alerts/markAsRead',
  async (alertId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      const response = await alertsApi.markAsRead(alertId, token);
      return response.data; // Should return the updated alert or success status
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (alertId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue('Authentication token not found.');
      await alertsApi.deleteAlert(alertId, token);
      return alertId; // Return ID of deleted alert
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllAlerts
      .addCase(getAllAlerts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllAlerts.fulfilled, (state, action: PayloadAction<PaginatedApiResult<Alert[]>>) => {
        state.loading = false;
        state.currentAlerts = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllAlerts.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // configureAlerts
      .addCase(configureAlerts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(configureAlerts.fulfilled, (state, action: PayloadAction<any>) => { // Type needs to be more specific
        state.loading = false;
        // Handle response if needed
      })
      .addCase(configureAlerts.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // markAsRead
      .addCase(markAsRead.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<Alert>) => { // Assuming it returns the updated alert
        state.loading = false;
        const index = state.currentAlerts.findIndex(alert => alert.id === action.payload.id);
        if (index !== -1) {
          state.currentAlerts[index] = action.payload;
        }
      })
      .addCase(markAsRead.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; })

      // deleteAlert
      .addCase(deleteAlert.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteAlert.fulfilled, (state, action: PayloadAction<string>) => { // action.payload is alertId
        state.loading = false;
        state.currentAlerts = state.currentAlerts.filter(alert => alert.id !== action.payload);
      })
      .addCase(deleteAlert.rejected, (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectCurrentAlerts = (state: RootState) => state.alerts.currentAlerts;
export const selectAlertsPagination = (state: RootState) => state.alerts.pagination;
export const selectAlertsLoading = (state: RootState) => state.alerts.loading;
export const selectAlertsError = (state: RootState) => state.alerts.error;

export default alertsSlice.reducer;
