// src/types/api.types.ts

// This file is intended for API specific types that might not fit directly into
// domain-specific types (e.g., generic success/error responses, pagination details
// specific to API structures).

import { ApiResponse, PaginatedResponse, ErrorResponse } from './common.types';

// Example: A generic type for a successful API response
export type SuccessResponse<T> = ApiResponse<T>;

// Example: A generic type for an error API response
export type ApiErrorResponse = ErrorResponse;

// Example: A generic type for paginated API results
export type PaginatedApiResult<T> = PaginatedResponse<T>;
