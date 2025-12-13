import { Request, Response, NextFunction } from 'express';
interface RoleRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare const authorizeRole: (requiredRoles: Array<"admin" | "investor" | "analyst">) => (req: RoleRequest, _res: Response, _next: NextFunction) => void;
export {};
//# sourceMappingURL=role.middleware.d.ts.map