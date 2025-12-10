// src/lib/api/thesis.api.ts

import { apiFetch } from './client';
import { InvestorThesis, CreateInvestorThesisPayload, UpdateInvestorThesisPayload } from '@/types/thesis.types';
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';
import { Deal } from '@/types/deal.types'; // Assuming Deal type is needed for matches

export const thesisApi = {
  createThesis: (thesisData: CreateInvestorThesisPayload, token: string): Promise<ApiResponse<InvestorThesis>> => {
    return apiFetch<ApiResponse<InvestorThesis>>('/thesis', {
      method: 'POST',
      body: JSON.stringify(thesisData),
      token,
    });
  },

  updateThesis: (thesisId: string, thesisData: UpdateInvestorThesisPayload, token: string): Promise<ApiResponse<InvestorThesis>> => {
    return apiFetch<ApiResponse<InvestorThesis>>(`/thesis/${thesisId}`, {
      method: 'PUT',
      body: JSON.stringify(thesisData),
      token,
    });
  },

  getThesisMatches: (dealId: string, token: string): Promise<ApiResponse<any>> => { // Response type needs to be defined
    return apiFetch<ApiResponse<any>>(`/thesis/matches/${dealId}`, {
      method: 'GET',
      token,
    });
  },

  getInvestorMatches: (investorId: string, token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Deal>> => { // Assuming it returns deals
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Deal>>(`/thesis/investor/${investorId}/matches?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  getInvestorTheses: (investorId: string, token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<InvestorThesis>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<InvestorThesis>>(`/thesis/investor/${investorId}?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  analyzeAlignment: (payload: { thesisId: string; dealId: string }, token: string): Promise<ApiResponse<any>> => { // Response type needs to be defined
    return apiFetch<ApiResponse<any>>(`/thesis/analyze`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  deactivateThesis: (thesisId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/thesis/${thesisId}`, {
      method: 'DELETE',
      token,
    });
  },
};
