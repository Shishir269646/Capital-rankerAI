export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data?: T;
    code: number;
    timestamp?: string;
    errors?: ValidationError[];
}
export interface ValidationError {
    field: string;
    message: string;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface FilterParams {
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    [key: string]: any;
}
//# sourceMappingURL=api.types.d.ts.map