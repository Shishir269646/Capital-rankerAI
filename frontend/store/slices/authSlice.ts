import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { authApi } from '@/lib/api/auth.api';
import { AuthResponse, LoginPayload, User, ChangePasswordPayload, UpdatePreferencesPayload } from '@/types/auth.types';
import { saveAuthTokens, clearAuthTokens, getAccessToken } from '@/lib/auth/token';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null, // Initialize to null
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      saveAuthTokens(response.tokens);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        await authApi.logout(token); // Call server-side logout
      }
    } catch (error: any) {
      console.error("Server-side logout failed (might be already logged out):", error);
      // Don't reject, proceed with client-side cleanup regardless
    } finally {
      dispatch(logout()); // Clear client-side state
    }
  }
);

// New Thunk: Fetch current user profile
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || getAccessToken(); // Try to get token from state or local storage
      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }
      const response = await authApi.getMe(token);
      return response.data; // Assuming response.data is the User object
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Refresh access token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken'); // Get refresh token from local storage
      if (!refreshTokenValue) {
        return rejectWithValue('Refresh token not found.');
      }
      const response = await authApi.refreshToken(refreshTokenValue);
      saveAuthTokens(response.tokens); // Save new tokens
      return response;
    } catch (error: any) {
      clearAuthTokens(); // Clear tokens on refresh failure
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }
      await authApi.changePassword(payload, token);
      return true; // Indicate success
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// New Thunk: Update user preferences
export const updatePreferences = createAsyncThunk(
  'auth/updatePreferences',
  async (payload: UpdatePreferencesPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        return rejectWithValue('Authentication token not found.');
      }
      const response = await authApi.updatePreferences(payload, token);
      return response.data; // Assuming response.data is the updated User object
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      clearAuthTokens();
      console.log("Client-side logout successful: Redux state and tokens cleared.");
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access.token;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getMe
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; // Clear user if fetching fails
        state.token = null; // Clear token if fetching fails
        clearAuthTokens();
      })
      // refreshToken
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.tokens.access.token; // Only access token is refreshed in this flow
      })
      .addCase(refreshToken.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; // Clear user on refresh failure
        state.token = null; // Clear token on refresh failure
        clearAuthTokens();
      })
      // changePassword
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        // Optionally, clear sensitive fields or trigger re-login for security
      })
      .addCase(changePassword.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updatePreferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        if (state.user) {
          state.user = action.payload; // Update preferences in the user object
        }
      })
      .addCase(updatePreferences.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setToken } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;