// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

/**
 * Load environment variables
 */
export function loadEnv(): void {
  const envPath = path.resolve(process.cwd(), '.env');
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    throw new Error(`Failed to load .env file: ${result.error.message}`);
  }
}

/**
 * Environment validation schema
 */
const envSchema = Joi.object({
  // Server
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),

  // Database
  MONGODB_URI: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.string().default('1d'),
  REFRESH_TOKEN_SECRET: Joi.string().required(),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_URL: Joi.string().optional(),

  // ML Service
  ML_SERVICE_URL: Joi.string().default('http://localhost:8000'),

  // External APIs
  DEALROOM_API_KEY: Joi.string().optional(),
  CRUNCHBASE_API_KEY: Joi.string().optional(),
  LINKEDIN_API_KEY: Joi.string().optional(),

  // Email
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),

  // Slack
  SLACK_WEBHOOK_URL: Joi.string().optional(),
  SLACK_BOT_TOKEN: Joi.string().optional(),

  // Features
  ENABLE_JOBS: Joi.boolean().default(true),

  // CORS
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'debug').default('info'),
}).unknown();

/**
 * Validate environment variables
 */
export function validateEnv(): void {
  const { error, value } = envSchema.validate(process.env);

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  // Set validated values back to process.env
  Object.assign(process.env, value);
}

/**
 * Get environment variable with type safety
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value || defaultValue || '';
}

/**
 * Check if production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if development environment
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if test environment
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}
