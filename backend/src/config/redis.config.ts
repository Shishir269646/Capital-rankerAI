// src/config/redis.config.ts
import Redis from 'ioredis';
import { logger } from './logger';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD, // Add password if needed
  lazyConnect: true, // Connect when command is issued
});

redisClient.on('connect', () => logger.info('Redis client connected'));
redisClient.on('error', (err) => logger.error('Redis client error', { error: err.message, stack: err.stack }));

async function connectRedis(): Promise<void> {
    if (redisClient.status !== 'ready') {
        try {
            await redisClient.connect();
        } catch (error: any) {
            logger.error('Failed to connect to Redis', { error: error.message });
            // Optionally, exit the process or handle the error appropriately
            // process.exit(1); 
        }
    }
}

// Ensure Redis connection is established on startup
// This might be called in server.ts similar to connectDatabase()
// For now, lazyConnect is true, so it will connect on first command.
// We can also connect explicitly if needed.

export { redisClient, connectRedis };
