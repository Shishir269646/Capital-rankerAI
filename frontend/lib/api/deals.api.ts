// src/lib/api/deals.api.ts

import { apiFetch } from './client';
import { Deal, CreateDealPayload, UpdateDealPayload } from '@/types/deal.types';
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

export const dealsApi = {
  getAllDeals: (token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Deal>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Deal>>(`/deals?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  getDealById: (dealId: string, token: string): Promise<ApiResponse<Deal>> => {
    return apiFetch<ApiResponse<Deal>>(`/deals/${dealId}`, {
      method: 'GET',
      token,
    });
  },

  createDeal: (dealData: CreateDealPayload, token: string): Promise<ApiResponse<Deal>> => {
    return apiFetch<ApiResponse<Deal>>('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
      token,
    });
  },

  updateDeal: (dealId: string, dealData: UpdateDealPayload, token: string): Promise<ApiResponse<Deal>> => {
    return apiFetch<ApiResponse<Deal>>(`/deals/${dealId}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
      token,
    });
  },

  deleteDeal: (dealId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/deals/${dealId}`, {
      method: 'DELETE',
      token,
    });
  },

  searchDeals: (searchPayload: any, token: string): Promise<PaginatedApiResult<Deal[]>> => {
    return apiFetch<PaginatedApiResult<Deal[]>>('/deals/search', {
      method: 'POST',
      body: JSON.stringify(searchPayload),
      token,
    });
  },

  bulkImportDeals: (file: FormData, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>('/deals/bulk-import', {
      method: 'POST',
      body: file,
      token,
      headers: {
        // 'Content-Type': 'multipart/form-data', // fetch sets this automatically with FormData
      },
    });
  },

  getDealStats: (token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>('/deals/stats', {
      method: 'GET',
      token,
    });
  },

  getTopRankedDeals: (token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Deal[]>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Deal[]>>(`/deals/top-ranked?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  exportDeals: (token: string, format: 'csv' | 'xlsx', queryOptions?: QueryOptions): Promise<Blob> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<Blob>(`/deals/export?format=${format}&${queryString}`, {
      method: 'GET',
      token,
      // API expects Blob, so we need to tell apiFetch to not parse as JSON
      headers: { 'Accept': 'application/octet-stream' },
    });
  },

  getSimilarDeals: (dealId: string, token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Deal[]>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Deal[]>>(`/deals/${dealId}/similar?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  addDealNote: (dealId: string, noteContent: string, token: string): Promise<ApiResponse<Deal>> => {
    return apiFetch<ApiResponse<Deal>>(`/deals/${dealId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content: noteContent }),
      token,
    });
  },
};
