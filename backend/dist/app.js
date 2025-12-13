"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./config/logger");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    const corsOptions = {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 600,
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, express_mongo_sanitize_1.default)({
        replaceWith: '_',
        onSanitize: ({ req, key }) => {
            logger_1.logger.warn('Sanitized NoSQL injection attempt', {
                ip: req.ip,
                key,
                path: req.path,
            });
        },
    }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use((0, compression_1.default)());
    app.use(logger_middleware_1.httpLogger);
    if (process.env.NODE_ENV !== 'production') {
        app.use(logger_middleware_1.requestLogger);
    }
    app.use('/api', rate_limit_middleware_1.apiLimiter);
    app.get('/health', (_req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Capital Ranker API is healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: '1.0.0',
        });
    });
    app.use('/api', routes_1.default);
    app.get('/', (_req, res) => {
        res.status(200).json({
            name: 'Capital Ranker API',
            version: '1.0.0',
            description: 'AI-powered VC deal flow optimization platform',
            documentation: '/api/docs',
            health: '/health',
        });
    });
    app.use(error_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map