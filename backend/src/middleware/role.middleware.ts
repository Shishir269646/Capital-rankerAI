import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/error.util';

// Extending Express Request object to ensure user is present
interface RoleRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authorizeRole = (requiredRoles: Array<'admin' | 'investor' | 'analyst'>) => {
  return (req: RoleRequest, _res: Response, _next: NextFunction) => {
    // Check if authentication middleware ran successfully
    if (!req.user) {
      return _next(
        new CustomError(500, 'User role check failed: Authentication middleware did not run.')
      );
    }

    const userRole = req.user.role;

    if (!requiredRoles.includes(userRole as any)) {
      return _next(
        new CustomError(403, `Access denied. Role "${userRole}" cannot access this resource.`)
      );
    }

    _next();
  };
};

// Example Usage in Router: router.post('/deals', authenticateToken, authorizeRole(['investor', 'admin']), dealController.createDeal);
