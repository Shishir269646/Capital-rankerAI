export declare function successResponse<T = any>(message: string, data?: T, code?: number): {
    status: 'success';
    message: string;
    data?: T;
    code: number;
    timestamp: string;
};
export declare function errorResponse(message: string, code?: number, errors?: any[]): {
    status: 'error';
    message: string;
    code: number;
    errors?: any[];
    timestamp: string;
};
//# sourceMappingURL=response.util.d.ts.map