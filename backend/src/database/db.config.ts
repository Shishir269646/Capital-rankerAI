// src/database/db.config.ts
import mongoose from 'mongoose';
import { getEnv } from '../config/env';
import { logger } from '../config/logger'; // Assuming logger is available and desired

/**
 * Connects to MongoDB.
 */
export const connectDB = async () => {
  try {
    const MONGODB_URI = getEnv('MONGODB_URI');
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ MongoDB connected successfully.');
  } catch (err: any) {
    logger.error('❌ MongoDB connection error:', err);
    // Server should crash if DB connection fails
    process.exit(1);
  }
};
