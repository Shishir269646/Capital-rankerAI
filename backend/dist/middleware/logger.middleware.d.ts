import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare const httpLogger: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
export declare const requestLogger: (req: ErrorRequest, res: ErrorResponse, next: ErrorNext) => void;
export declare const asyncHandler: (fn: (req: ErrorRequest, res: ErrorResponse, next: ErrorNext) => Promise<any>) => (req: ErrorRequest, res: ErrorResponse, next: ErrorNext) => void;
//# sourceMappingURL=logger.middleware.d.ts.map