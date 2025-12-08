// src/lib/auth/session.ts

import { getAccessToken, getRefreshToken, isAccessTokenExpired, isRefreshTokenExpired, saveAuthTokens, clearAuthTokens } from './token';
import { authApi } from '../api/auth.api'; // Assuming authApi has refreshToken method

/**
 * Checks if a user is currently authenticated based on the presence and validity of tokens.
 * @returns {boolean} True if authenticated, false otherwise.
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return false;
  }

  // If both tokens exist, consider authenticated for now.
  // A more robust check would involve verifying token expiry and attempting refresh.
  return true;
};

/**
 * Attempts to refresh the access token using the refresh token.
 * If successful, updates the stored tokens.
 * @returns {Promise<boolean>} True if tokens were successfully refreshed, false otherwise.
 */
export const refreshAuthTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken || isRefreshTokenExpired()) {
    console.warn('No refresh token available or refresh token expired. User needs to re-login.');
    clearAuthTokens();
    return false;
  }

  try {
    const response = await authApi.refreshToken(refreshToken);
    if (response && response.tokens) {
      saveAuthTokens(response.tokens);
      console.log('Tokens successfully refreshed.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to refresh tokens:', error);
    clearAuthTokens(); // Clear tokens if refresh fails
    return false;
  }
};

/**
 * Ensures the access token is valid. If expired, attempts to refresh it.
 * If no tokens or refresh fails, clears all tokens.
 * @returns {Promise<string | null>} The valid access token, or null if unauthenticated.
 */
export const ensureAuthToken = async (): Promise<string | null> => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    console.log('No access token found.');
    return null;
  }

  if (isAccessTokenExpired()) {
    console.log('Access token expired, attempting to refresh...');
    const refreshed = await refreshAuthTokens();
    if (refreshed) {
      accessToken = getAccessToken(); // Get the new access token
    } else {
      return null; // Refresh failed, return null
    }
  }

  return accessToken;
};
