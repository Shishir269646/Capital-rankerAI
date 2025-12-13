import { Request as ErrorRequest, Response as ErrorResponse, NextFunction as ErrorNext } from 'express';
export declare class AuthController {
    register(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    login(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    refreshToken(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    logout(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    getCurrentUser(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    updatePreferences(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
    changePassword(req: ErrorRequest, res: ErrorResponse, next: ErrorNext): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map