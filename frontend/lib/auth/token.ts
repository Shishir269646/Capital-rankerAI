// src/lib/auth/token.ts

import { getItem, setItem, removeItem } from '../utils/localStorage';
import { AuthTokens } from '@/types/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_EXPIRES_KEY = 'accessTokenExpires';
const REFRESH_TOKEN_EXPIRES_KEY = 'refreshTokenExpires';

export const saveAuthTokens = (tokens: AuthTokens): void => {
  setItem(ACCESS_TOKEN_KEY, tokens.access.token);
  setItem(REFRESH_TOKEN_KEY, tokens.refresh.token);
  setItem(ACCESS_TOKEN_EXPIRES_KEY, tokens.access.expires.toISOString());
  setItem(REFRESH_TOKEN_EXPIRES_KEY, tokens.refresh.expires.toISOString());
};

export const getAccessToken = (): string | null => {
  return getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return getItem(REFRESH_TOKEN_KEY);
};

export const getAccessTokenExpires = (): Date | null => {
  const expires = getItem(ACCESS_TOKEN_EXPIRES_KEY);
  return expires ? new Date(expires) : null;
};

export const getRefreshTokenExpires = (): Date | null => {
  const expires = getItem(REFRESH_TOKEN_EXPIRES_KEY);
  return expires ? new Date(expires) : null;
};

export const clearAuthTokens = (): void => {
  removeItem(ACCESS_TOKEN_KEY);
  removeItem(REFRESH_TOKEN_KEY);
  removeItem(ACCESS_TOKEN_EXPIRES_KEY);
  removeItem(REFRESH_TOKEN_EXPIRES_KEY);
  clearAuthCookie(); // Clear the auth cookie as well
};

export const clearAuthCookie = (): void => {
  if (typeof document !== 'undefined') {
    document.cookie = `auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};


export const isAccessTokenExpired = (): boolean => {
  const expires = getAccessTokenExpires();
  return expires ? new Date() > expires : true;
};

export const isRefreshTokenExpired = (): boolean => {
  const expires = getRefreshTokenExpires();
  return expires ? new Date() > expires : true;
};
