// src/lib/api/auth.api.ts

import { apiFetch } from './client';
import { LoginPayload, AuthResponse, RegisterPayload, User, ChangePasswordPayload, UpdatePreferencesPayload } from '@/types/auth.types';
import { ApiResponse } from '@/types/common.types';

export const authApi = {
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await apiFetch<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  },

  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiFetch<{ data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  logout: (token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>('/auth/logout', {
      method: 'POST',
      token,
    });
  },

  getMe: (token: string): Promise<ApiResponse<User>> => {
    return apiFetch<ApiResponse<User>>('/auth/me', {
      method: 'GET',
      token,
    });
  },

  refreshToken: (refreshToken: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      isRefreshTokenRequest: true, // Mark this request as a token refresh
    });
  },

  changePassword: (payload: ChangePasswordPayload, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    });
  },

  updatePreferences: (payload: UpdatePreferencesPayload, token: string): Promise<ApiResponse<User>> => {
    return apiFetch<ApiResponse<User>>('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    });
  },
};
