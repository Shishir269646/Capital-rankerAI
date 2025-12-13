"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRateLimitMiddleware = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redis_config_1 = require("../config/redis.config");
const loginLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redis_config_1.redisClient,
    points: 5,
    duration: 60,
    execEvenly: false,
});
const loginRateLimitMiddleware = async (req, res, next) => {
    try {
        await loginLimiter.consume(req.ip);
        next();
    }
    catch {
        return res
            .status(429)
            .json({ success: false, message: 'Too many login attempts, try again later!' });
    }
};
exports.loginRateLimitMiddleware = loginRateLimitMiddleware;
//# sourceMappingURL=scriptFreeRateLimit.middleware.js.map