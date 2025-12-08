import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../config/redis.config';

const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5, // 5 requests
  duration: 60, // per 60 seconds
  execEvenly: false, // no lua


});

// express middleware
export const loginRateLimitMiddleware = async (req: any, res: any, next: any) => {
  // Added types for req, res, next
  try {
    await loginLimiter.consume(req.ip);
    next();
  } catch {
    return res
      .status(429)
      .json({ success: false, message: 'Too many login attempts, try again later!' });
  }
};
