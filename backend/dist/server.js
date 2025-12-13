"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const app_1 = require("./app");
const database_1 = require("./config/database");
const logger_1 = require("./config/logger");
const jobs_1 = require("./jobs");
const env_1 = require("./config/env");
const redis_config_1 = require("./config/redis.config");
let isServerListening = false;
async function startServer() {
    if (isServerListening) {
        logger_1.logger.warn('Server is already listening, skipping listen call.', {
            service: 'capital-ranker-api',
        });
        return;
    }
    try {
        (0, env_1.loadEnv)();
        (0, env_1.validateEnv)();
        logger_1.logger.info('Connecting to database...');
        await (0, database_1.connectDatabase)();
        logger_1.logger.info('Database connected successfully');
        logger_1.logger.info('Connecting to Redis...');
        await (0, redis_config_1.connectRedis)();
        logger_1.logger.info('Redis connected successfully');
        const app = (0, app_1.createApp)();
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            isServerListening = true;
            logger_1.logger.info(`Server started successfully`, {
                port: PORT,
                environment: process.env.NODE_ENV,
                nodeVersion: process.version,
            });
            logger_1.logger.info(`API available at: http://localhost:${PORT}/api`);
            logger_1.logger.info(`Health check: http://localhost:${PORT}/health`);
        });
        if (process.env.ENABLE_JOBS === 'true') {
            logger_1.logger.info('Initializing background jobs...');
            (0, jobs_1.initializeJobs)();
            logger_1.logger.info('Background jobs initialized');
        }
        const gracefulShutdown = async (signal) => {
            logger_1.logger.info(`${signal} received. Starting graceful shutdown...`);
            server.close(async () => {
                logger_1.logger.info('HTTP server closed');
                try {
                    const mongoose = require('mongoose');
                    await mongoose.connection.close();
                    logger_1.logger.info('Database connection closed');
                }
                catch (error) {
                    logger_1.logger.error('Error closing database connection', {
                        error: error.message,
                    });
                }
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.logger.error('Unhandled Rejection', {
                reason: reason?.message || reason,
                stack: reason?.stack,
                promise,
            });
            if (process.env.NODE_ENV === 'production') {
                gracefulShutdown('UNHANDLED_REJECTION');
            }
        });
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('Uncaught Exception', {
                error: error.message,
                stack: error.stack,
            });
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server', {
            error: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
}
if (require.main === module) {
    startServer();
}
//# sourceMappingURL=server.js.map