import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class ReportController {
    generateReport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    downloadReport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getDealReport(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const reportController: ReportController;
//# sourceMappingURL=report.controller.d.ts.map