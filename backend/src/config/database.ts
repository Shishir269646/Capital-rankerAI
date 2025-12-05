import mongoose from 'mongoose';
import { logger } from './logger';

/**
 * Connect to MongoDB
 */
export async function connectDatabase(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    // Mongoose connection options
    const options: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    };

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, options);

    logger.info('MongoDB connected successfully', {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
    });

    // Connection event listeners
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error', {
        error: error.message,
        stack: error.stack,
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

    // Enable mongoose debug in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug('Mongoose query', {
          collection: collectionName,
          method,
          query: JSON.stringify(query),
          doc: JSON.stringify(doc),
        });
      });
    }
  } catch (error: any) {
    logger.error('Failed to connect to MongoDB', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected');
  } catch (error: any) {
    logger.error('Error disconnecting from MongoDB', {
      error: error.message,
    });
    throw error;
  }
}
