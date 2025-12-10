// src/server.ts
import { createApp } from './app';
import { connectDatabase } from './config/database';
import { logger } from './config/logger';
import { initializeJobs } from './jobs';
import { loadEnv, validateEnv } from './config/env';
import { connectRedis } from './config/redis.config'; // Import connectRedis

/**
 * Start the server
 */
let isServerListening = false;

async function startServer(): Promise<void> {
  if (isServerListening) {
    logger.warn('Server is already listening, skipping listen call.', {
      service: 'capital-ranker-api',
    });
    return;
  }

  try {
    // ============================================
    // Load and Validate Environment Variables
    // ============================================
    loadEnv();
    validateEnv();

    // ============================================
    // Database connection
    // ============================================

    logger.info('Connecting to database...');
    await connectDatabase();
    logger.info('Database connected successfully');

    // ============================================
    // Redis connection
    // ============================================
    logger.info('Connecting to Redis...');
    await connectRedis();
    logger.info('Redis connected successfully');

    // ============================================
    // Create Express app
    // ============================================

    const app = createApp();
    const PORT = process.env.PORT || 5000;

    // ============================================
    // Start server
    // ============================================

    const server = app.listen(PORT, () => {
      isServerListening = true; // Set flag to true
      logger.info(`Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
      });

      logger.info(`API available at: http://localhost:${PORT}/api`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });

    // ============================================
    // Initialize background jobs
    // ============================================

    if (process.env.ENABLE_JOBS === 'true') {
      logger.info('Initializing background jobs...');
      initializeJobs();
      logger.info('Background jobs initialized');
    }

    // ============================================
    // Graceful shutdown
    // ============================================

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        // Close database connection
        try {
          const mongoose = require('mongoose');
          await mongoose.connection.close();
          logger.info('Database connection closed');
        } catch (error: any) {
          logger.error('Error closing database connection', {
            error: error.message,
          });
        }

        // Exit process
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ============================================
    // Unhandled errors
    // ============================================

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.error('Unhandled Rejection', {
        reason: reason?.message || reason,
        stack: reason?.stack,
        promise,
      });

      // Exit in production
      if (process.env.NODE_ENV === 'production') {
        gracefulShutdown('UNHANDLED_REJECTION');
      }
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack,
      });

      // Exit immediately
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
  } catch (error: any) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// ============================================
// Start the application
// ============================================

if (require.main === module) {
  startServer();
}

export { startServer };
