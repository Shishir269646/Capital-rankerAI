// src/lib/api/portfolio.api.ts

import { apiFetch } from './client';
import { Portfolio, CreatePortfolioPayload, UpdatePortfolioPayload, PortfolioPerformance } from '@/types/portfolio.types';
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

export const portfolioApi = {
  // NOTE: The following four functions (getAllPortfolios, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio)
  // are present in the frontend API client but some of their corresponding routes were NOT explicitly listed
  // in the provided `backend/src/routes/v1/portfolio.routes.ts`.
  // This might indicate implicit backend routes or a partial routes definition.
  getAllPortfolios: (token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Portfolio>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Portfolio>>(`/portfolio?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  getPortfolioById: (portfolioId: string, token: string): Promise<ApiResponse<Portfolio>> => {
    return apiFetch<ApiResponse<Portfolio>>(`/portfolio/${portfolioId}`, {
      method: 'GET',
      token,
    });
  },

  createPortfolio: (portfolioData: CreatePortfolioPayload, token: string): Promise<ApiResponse<Portfolio>> => {
    return apiFetch<ApiResponse<Portfolio>>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(portfolioData),
      token,
    });
  },

  createPortfolioItem: (payload: { startup_id: string }, token: string): Promise<ApiResponse<Portfolio>> => {
    return apiFetch<ApiResponse<Portfolio>>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  updatePortfolio: (portfolioId: string, portfolioData: UpdatePortfolioPayload, token: string): Promise<ApiResponse<Portfolio>> => {
    return apiFetch<ApiResponse<Portfolio>>(`/portfolio/${portfolioId}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioData),
      token,
    });
  },

  deletePortfolio: (portfolioId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/portfolio/${portfolioId}`, {
      method: 'DELETE',
      token,
    });
  },

  getPortfolioPerformance: (token: string, queryOptions?: QueryOptions): Promise<ApiResponse<PortfolioPerformance>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<ApiResponse<PortfolioPerformance>>(`/portfolio/performance?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  getAnalytics: (token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/portfolio/analytics`, {
      method: 'GET',
      token,
    });
  },

  updateMetrics: (portfolioId: string, metricsData: any, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/portfolio/${portfolioId}/update`, {
      method: 'POST',
      body: JSON.stringify(metricsData),
      token,
    });
  },
};
