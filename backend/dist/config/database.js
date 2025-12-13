"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
async function connectDatabase() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }
    try {
        const options = {
            maxPoolSize: 10,
            minPoolSize: 5,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
        };
        await mongoose_1.default.connect(MONGODB_URI, options);
        logger_1.logger.info('MongoDB connected successfully', {
            host: mongoose_1.default.connection.host,
            database: mongoose_1.default.connection.name,
        });
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.logger.error('MongoDB connection error', {
                error: error.message,
                stack: error.stack,
            });
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            logger_1.logger.info('MongoDB reconnected successfully');
        });
        if (process.env.NODE_ENV === 'development') {
            mongoose_1.default.set('debug', (collectionName, method, query, doc) => {
                logger_1.logger.debug('Mongoose query', {
                    collection: collectionName,
                    method,
                    query: JSON.stringify(query),
                    doc: JSON.stringify(doc),
                });
            });
        }
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to MongoDB', {
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
}
async function disconnectDatabase() {
    try {
        await mongoose_1.default.connection.close();
        logger_1.logger.info('MongoDB disconnected');
    }
    catch (error) {
        logger_1.logger.error('Error disconnecting from MongoDB', {
            error: error.message,
        });
        throw error;
    }
}
//# sourceMappingURL=database.js.map