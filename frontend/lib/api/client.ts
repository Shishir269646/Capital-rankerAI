// src/lib/api/client.ts

import { AuthTokens } from '@/types/auth.types';
import {
  saveAuthTokens,
  getAccessToken as getAccessTokenUtil,
  getRefreshToken as getRefreshTokenUtil,
  clearAuthTokens as clearAuthTokensUtil
} from '../auth/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

interface RequestOptions extends RequestInit {
  token?: string | null;
  isRefreshTokenRequest?: boolean;
}

export async function apiFetch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const { token, isRefreshTokenRequest, headers, ...rest } = options || {};

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    // Handle specific error codes or refresh token logic here if needed
    throw new Error(errorData.message || 'Something went wrong with the API request');
  }

  return response.json();
}

// Function to handle token storage using the new utility
export const setAuthTokens = (tokens: AuthTokens) => {
  saveAuthTokens(tokens);
};

export const getAccessToken = (): string | null => {
  return getAccessTokenUtil();
};

export const getRefreshToken = (): string | null => {
  return getRefreshTokenUtil();
};

export const clearAuthTokens = () => {
  clearAuthTokensUtil();
};
