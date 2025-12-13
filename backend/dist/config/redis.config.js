"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
});
exports.redisClient = redisClient;
redisClient.on('connect', () => logger_1.logger.info('Redis client connected'));
redisClient.on('error', (err) => logger_1.logger.error('Redis client error', { error: err.message, stack: err.stack }));
async function connectRedis() {
    if (redisClient.status !== 'ready') {
        try {
            await redisClient.connect();
        }
        catch (error) {
            logger_1.logger.error('Failed to connect to Redis', { error: error.message });
        }
    }
}
//# sourceMappingURL=redis.config.js.map