// src/lib/api/scoring.api.ts

import { apiFetch } from './client';
import { Score, CreateScorePayload } from '@/types/scoring.types'; // CreateScorePayload might not be directly used here but keep for context
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';
import { Deal } from '@/types/deal.types'; // Assuming Deal type is needed for scoreDeal/history/compare

export const scoringApi = {
  scoreDeal: (dealId: string, token: string, customWeights?: any): Promise<ApiResponse<{ score: Score }>> => {
    return apiFetch<ApiResponse<{ score: Score }>>(`/scoring/deal/${dealId}`, {
      method: 'POST',
      body: JSON.stringify({ custom_weights: customWeights }),
      token,
    });
  },

  getDealScoringHistory: (dealId: string, token: string, queryOptions?: QueryOptions): Promise<ApiResponse<{ history: Score[] }>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<ApiResponse<{ history: Score[] }>>(`/scoring/deal/${dealId}/history?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  batchScore: (dealIds: string[], token: string): Promise<ApiResponse<{ job_id: string; status: string; total_deals: number }>> => {
    return apiFetch<ApiResponse<{ job_id: string; status: string; total_deals: number }>>(`/scoring/batch`, {
      method: 'POST',
      body: JSON.stringify({ deal_ids: dealIds }),
      token,
    });
  },

  getBatchScoringJobStatus: (jobId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/scoring/batch/${jobId}/status`, {
      method: 'GET',
      token,
    });
  },

  getAllBatchScoringJobStatuses: (token: string): Promise<ApiResponse<any[]>> => {
    return apiFetch<ApiResponse<any[]>>(`/scoring/batch/status`, {
      method: 'GET',
      token,
    });
  },

  recalculateAllScores: (token: string): Promise<ApiResponse<{ job_id: string; status: string }>> => {
    return apiFetch<ApiResponse<{ job_id: string; status: string }>>(`/scoring/recalculate-all`, {
      method: 'POST',
      token,
    });
  },

  compareDealScores: (dealIds: string[], token: string): Promise<ApiResponse<{ deals: { deal: Deal, score: Score }[], comparison: any }>> => {
    return apiFetch<ApiResponse<{ deals: { deal: Deal, score: Score }[], comparison: any }>>(`/scoring/compare`, {
      method: 'POST',
      body: JSON.stringify({ deal_ids: dealIds }),
      token,
    });
  },
};
