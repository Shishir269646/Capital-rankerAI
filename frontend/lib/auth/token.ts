// src/lib/auth/token.ts

import { getItem, setItem, removeItem } from '../utils/localStorage';
import Cookies from 'js-cookie';
import { AuthTokens } from '@/types/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_EXPIRES_KEY = 'accessTokenExpires';
const REFRESH_TOKEN_EXPIRES_KEY = 'refreshTokenExpires';
const AUTH_TOKEN_COOKIE_KEY = 'auth-token';

export const saveAuthTokens = (tokens: AuthTokens): void => {
  setItem(ACCESS_TOKEN_KEY, tokens.access.token);
  setItem(REFRESH_TOKEN_KEY, tokens.refresh.token);
  setItem(ACCESS_TOKEN_EXPIRES_KEY, tokens.access.expires.toISOString());
  setItem(REFRESH_TOKEN_EXPIRES_KEY, tokens.refresh.expires.toISOString());
};

export const getAccessToken = (): string | null => {
  return getItem<string>(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return getItem<string>(REFRESH_TOKEN_KEY);
};

export const getAccessTokenExpires = (): Date | null => {
  const expires = getItem<string>(ACCESS_TOKEN_EXPIRES_KEY);
  return expires ? new Date(expires) : null;
};

export const getRefreshTokenExpires = (): Date | null => {
  const expires = getItem<string>(REFRESH_TOKEN_EXPIRES_KEY);
  return expires ? new Date(expires) : null;
};

export const clearAuthTokens = (): void => {
  removeItem(ACCESS_TOKEN_KEY);
  removeItem(REFRESH_TOKEN_KEY);
  removeItem(ACCESS_TOKEN_EXPIRES_KEY);
  removeItem(REFRESH_TOKEN_EXPIRES_KEY);
  Cookies.remove(AUTH_TOKEN_COOKIE_KEY, { path: '/' }); // Clear the auth-token cookie
};

export const isAccessTokenExpired = (): boolean => {
  const expires = getAccessTokenExpires();
  return expires ? new Date() > expires : true;
};

export const isRefreshTokenExpired = (): boolean => {
  const expires = getRefreshTokenExpires();
  return expires ? new Date() > expires : true;
};
