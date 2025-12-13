import Redis from 'ioredis';
declare const redisClient: Redis;
declare function connectRedis(): Promise<void>;
export { redisClient, connectRedis };
//# sourceMappingURL=redis.config.d.ts.map