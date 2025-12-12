// src/lib/api/startup.api.ts

import { apiFetch } from './client';
import { Startup, CreateStartupPayload, UpdateStartupPayload } from '@/types/startup.types';
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

export const startupApi = {
  getAllStartups: (token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Startup>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Startup>>(`/startups?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  getStartupById: (startupId: string, token: string): Promise<ApiResponse<Startup>> => {
    return apiFetch<ApiResponse<Startup>>(`/startups/${startupId}`, {
      method: 'GET',
      token,
    });
  },

  createStartup: (startupData: CreateStartupPayload, token: string): Promise<ApiResponse<Startup>> => {
    return apiFetch<ApiResponse<Startup>>('/startups', {
      method: 'POST',
      body: JSON.stringify(startupData),
      token,
    });
  },

  updateStartup: (startupId: string, startupData: UpdateStartupPayload, token: string): Promise<ApiResponse<Startup>> => {
    return apiFetch<ApiResponse<Startup>>(`/startups/${startupId}`, {
      method: 'PUT',
      body: JSON.stringify(startupData),
      token,
    });
  },

  deleteStartup: (startupId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/startups/${startupId}`, {
      method: 'DELETE',
      token,
    });
  },
};
