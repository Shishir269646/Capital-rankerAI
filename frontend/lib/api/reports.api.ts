// src/lib/api/reports.api.ts

import { apiFetch } from './client';
import { Report, GenerateReportPayload } from '@/types/report.types';
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types'; // Retain if PaginatedApiResult is used elsewhere, though not for these specific endpoints

export const reportsApi = {
  requestReportGeneration: (payload: GenerateReportPayload, token: string): Promise<ApiResponse<Report>> => {
    return apiFetch<ApiResponse<Report>>(`/reports/generate`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  downloadReport: (reportId: string, token: string): Promise<Blob> => {
    return apiFetch<Blob>(`/reports/${reportId}`, { // Changed endpoint
      method: 'GET',
      token,
      headers: {
        'Accept': 'application/octet-stream', // Explicitly request binary data
      },
    });
  },

  getDealReport: (dealId: string, token: string): Promise<ApiResponse<any>> => { // Response type needs to be defined
    return apiFetch<ApiResponse<any>>(`/reports/deals/${dealId}`, {
      method: 'GET',
      token,
    });
  },
};
