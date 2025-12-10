// src/lib/api/alerts.api.ts

import { apiFetch } from './client';
import { Alert, UpdateAlertPayload } from '@/types/alert.types'; // UpdateAlertPayload might not be directly used here for now
import { ApiResponse, QueryOptions } from '@/types/common.types';
import { PaginatedApiResult } from '@/types/api.types';

export const alertsApi = {
  getAllAlerts: (token: string, queryOptions?: QueryOptions): Promise<PaginatedApiResult<Alert>> => {
    const queryString = queryOptions ? new URLSearchParams(queryOptions as any).toString() : '';
    return apiFetch<PaginatedApiResult<Alert>>(`/alerts?${queryString}`, {
      method: 'GET',
      token,
    });
  },

  configureAlerts: (payload: any, token: string): Promise<ApiResponse<any>> => { // Payload type needs to be defined
    return apiFetch<ApiResponse<any>>(`/alerts/configure`, {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    });
  },

  markAsRead: (alertId: string, token: string): Promise<ApiResponse<Alert>> => {
    return apiFetch<ApiResponse<Alert>>(`/alerts/${alertId}/read`, {
      method: 'PUT',
      token,
    });
  },

  deleteAlert: (alertId: string, token: string): Promise<ApiResponse<any>> => {
    return apiFetch<ApiResponse<any>>(`/alerts/${alertId}`, {
      method: 'DELETE',
      token,
    });
  },
};
