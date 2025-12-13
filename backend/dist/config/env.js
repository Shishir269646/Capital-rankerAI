"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
exports.validateEnv = validateEnv;
exports.getEnv = getEnv;
exports.isProduction = isProduction;
exports.isDevelopment = isDevelopment;
exports.isTest = isTest;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
function loadEnv() {
    const envPath = path_1.default.resolve(process.cwd(), '.env');
    const result = dotenv_1.default.config({ path: envPath });
    if (result.error) {
        throw new Error(`Failed to load .env file: ${result.error.message}`);
    }
}
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid('development', 'staging', 'production', 'test')
        .default('development'),
    PORT: joi_1.default.number().default(5000),
    MONGODB_URI: joi_1.default.string().required(),
    JWT_SECRET: joi_1.default.string().required(),
    JWT_EXPIRE: joi_1.default.string().default('1d'),
    REFRESH_TOKEN_SECRET: joi_1.default.string().required(),
    REDIS_HOST: joi_1.default.string().default('localhost'),
    REDIS_PORT: joi_1.default.number().default(6379),
    REDIS_URL: joi_1.default.string().optional(),
    ML_SERVICE_URL: joi_1.default.string().default('http://localhost:8000'),
    DEALROOM_API_KEY: joi_1.default.string().optional(),
    CRUNCHBASE_API_KEY: joi_1.default.string().optional(),
    LINKEDIN_API_KEY: joi_1.default.string().optional(),
    SMTP_HOST: joi_1.default.string().optional(),
    SMTP_PORT: joi_1.default.number().optional(),
    SMTP_USER: joi_1.default.string().optional(),
    SMTP_PASS: joi_1.default.string().optional(),
    SLACK_WEBHOOK_URL: joi_1.default.string().optional(),
    SLACK_BOT_TOKEN: joi_1.default.string().optional(),
    ENABLE_JOBS: joi_1.default.boolean().default(true),
    ALLOWED_ORIGINS: joi_1.default.string().default('http://localhost:3000'),
    LOG_LEVEL: joi_1.default.string().valid('error', 'warn', 'info', 'http', 'debug').default('info'),
}).unknown();
function validateEnv() {
    const { error, value } = envSchema.validate(process.env);
    if (error) {
        throw new Error(`Environment validation error: ${error.message}`);
    }
    Object.assign(process.env, value);
}
function getEnv(key, defaultValue) {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value || defaultValue || '';
}
function isProduction() {
    return process.env.NODE_ENV === 'production';
}
function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}
function isTest() {
    return process.env.NODE_ENV === 'test';
}
//# sourceMappingURL=env.js.map