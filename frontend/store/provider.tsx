'use client';

import { Provider, useDispatch } from 'react-redux';
import { store } from './index';
import { ReactNode, useEffect } from 'react';
import { getAccessToken, clearAuthTokens as clearAuthTokensUtil } from '@/lib/auth/token';
import { setToken } from './slices/authSlice';
import { authApi } from '@/lib/api/auth.api'; // Import authApi

// This component will be a child of the Redux Provider, so it can use useDispatch
function TokenInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          // Attempt to fetch user data to validate the token
          await authApi.getMe(token);
          dispatch(setToken(token)); // If successful, set the token
        } catch (error) {
          // If token is invalid or expired, clear it
          console.error("Invalid or expired token found, clearing...", error);
          dispatch(setToken(null)); // Clear from Redux state
          clearAuthTokensUtil(); // Clear from local storage
        }
      }
    };
    initializeAuth();
  }, [dispatch]);

  return null; // This component doesn't render anything itself
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <TokenInitializer />
      {children}
    </Provider>
  );
}
