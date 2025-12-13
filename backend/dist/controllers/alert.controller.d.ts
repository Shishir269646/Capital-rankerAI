import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class AlertController {
    getAlerts(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    configureAlerts(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    markAsRead(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    deleteAlert(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const alertController: AlertController;
//# sourceMappingURL=alert.controller.d.ts.map