"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
const connectDB = async () => {
    try {
        const MONGODB_URI = (0, env_1.getEnv)('MONGODB_URI');
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose_1.default.connect(MONGODB_URI);
        logger_1.logger.info('✅ MongoDB connected successfully.');
    }
    catch (err) {
        logger_1.logger.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.config.js.map