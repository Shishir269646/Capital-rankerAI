// src/types/common.types.ts

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  statusCode?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: Pagination;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: any[];
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  [key: string]: any; // Allow for other filter parameters
}
