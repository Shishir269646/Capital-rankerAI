export function successResponse<T = any>(
  message: string,
  data?: T,
  code: number = 200
): {
  status: 'success';
  message: string;
  data?: T;
  code: number;
  timestamp: string;
} {
  return {
    status: 'success',
    message,
    ...(data && { data }),
    code,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  code: number = 500,
  errors?: any[]
): {
  status: 'error';
  message: string;
  code: number;
  errors?: any[];
  timestamp: string;
} {
  return {
    status: 'error',
    message,
    code,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  };
}
