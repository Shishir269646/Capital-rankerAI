import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dealsReducer from './slices/dealsSlice';
import foundersReducer from './slices/foundersSlice';
import portfolioReducer from './slices/portfolioSlice';
import scoringReducer from './slices/scoringSlice';
import thesisReducer from './slices/thesisSlice';
import alertsReducer from './slices/alertsSlice';
import uiReducer from './slices/uiSlice';
import reportsReducer from './slices/reportsSlice';
import startupReducer from './slices/startupSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deals: dealsReducer,
    founders: foundersReducer,
    portfolio: portfolioReducer,
    scoring: scoringReducer,
    thesis: thesisReducer,
    alerts: alertsReducer,
    ui: uiReducer,
    reports: reportsReducer,
    startups: startupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
