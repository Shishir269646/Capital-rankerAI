import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: (error: Error | AppError, req: ErrorRequest, res: ErrorResponse, _next: ErrorNext) => void;
export declare const notFoundHandler: (req: ErrorRequest, res: ErrorResponse, _next: ErrorNext) => void;
//# sourceMappingURL=error.middleware.d.ts.map