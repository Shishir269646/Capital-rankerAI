"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(message, data, code = 200) {
    return {
        status: 'success',
        message,
        ...(data && { data }),
        code,
        timestamp: new Date().toISOString(),
    };
}
function errorResponse(message, code = 500, errors) {
    return {
        status: 'error',
        message,
        code,
        ...(errors && { errors }),
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=response.util.js.map