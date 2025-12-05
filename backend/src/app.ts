// src/app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';

// Middleware imports
import { httpLogger, requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rate-limit.middleware';

// Routes import
import routes from './routes';

// Config imports
import { logger } from './config/logger';

/**
 * Create Express application
 */
export function createApp(): Application {
  const app: Application = express();

  // ============================================
  // Security Middleware
  // ============================================

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600,
  };
  app.use(cors(corsOptions));

  // Prevent NoSQL injection
  app.use(
    mongoSanitize({
      replaceWith: '_',
      onSanitize: ({ req, key }) => {
        logger.warn('Sanitized NoSQL injection attempt', {
          ip: req.ip,
          key,
          path: req.path,
        });
      },
    })
  );

  // ============================================
  // Body Parsing Middleware
  // ============================================

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(compression());

  // ============================================
  // Logging Middleware
  // ============================================

  app.use(httpLogger);

  if (process.env.NODE_ENV !== 'production') {
    app.use(requestLogger);
  }

  // ============================================
  // Rate Limiting
  // ============================================

  app.use('/api', apiLimiter);

  // ============================================
  // Health Check Endpoint
  // ============================================

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Capital Ranker API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    });
  });

  // ============================================
  // API Routes
  // ============================================

  app.use('/api', routes);

  // ============================================
  // Root Route
  // ============================================

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'Capital Ranker API',
      version: '1.0.0',
      description: 'AI-powered VC deal flow optimization platform',
      documentation: '/api/docs',
      health: '/health',
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
