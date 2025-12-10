// src/lib/api/founders.api.ts

import { apiFetch } from './client';
import { Founder, CreateFounderPayload, UpdateFounderPayload } from '@/types/founder.types';
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

export const foundersApi = {
  // NOTE: The following three functions (getAllFounders, createFounder, deleteFounder)
  // are present in the frontend API client but their corresponding routes (GET /founders, POST /founders, DELETE /founders/:id)
  // were NOT explicitly listed in the provided `backend/src/routes/v1/founder.routes.ts`.
  // This might indicate an implicit backend route or a partial routes definition.
  getAllFounders: (token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Founder>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Founder>>(`/founders?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  getFounderById: (founderId: string, token: string): Promise<ApiResponse<Founder>> => {
    return apiFetch<ApiResponse<Founder>>(`/founders/${founderId}`, {
      method: 'GET',
      token,
    });
  },

  createFounder: (founderData: CreateFounderPayload, token: string): Promise<ApiResponse<Founder>> => {
    return apiFetch<ApiResponse<Founder>>('/founders', {
      method: 'POST',
      body: JSON.stringify(founderData),
      token,
    });
  },

  updateFounder: (founderId: string, founderData: UpdateFounderPayload, token: string): Promise<ApiResponse<Founder>> => {
    return apiFetch<ApiResponse<Founder>>(`/founders/${founderId}`, {
      method: 'PUT',
      body: JSON.stringify(founderData),
      token,
    });
  },

  deleteFounder: (founderId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/founders/${founderId}`, {
      method: 'DELETE',
      token,
    });
  },

  evaluateFounder: (founderId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/founders/evaluate/${founderId}`, {
      method: 'POST', // Assuming it's a POST as per backend route
      token,
    });
  },

  getFoundersByStartup: (startupId: string, token: string): Promise<PaginatedApiResult<Founder[]>> => {
    return apiFetch<PaginatedApiResult<Founder[]>>(`/founders/startup/${startupId}`, {
      method: 'GET',
      token,
    });
  },
};

