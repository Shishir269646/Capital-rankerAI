// src/routes/index.ts
import { Router } from 'express';
import authRouter from './v1/auth.routes';
import dealRouter from './v1/deal.routes';
import scoringRouter from './v1/scoring.routes';
import { thesisRouter } from './v1/thesis.routes';
import { founderRouter } from './v1/founder.routes';
import { alertRouter } from './v1/alert.routes';
import { portfolioRouter } from './v1/portfolio.routes';
import { reportRouter } from './v1/report.routes';

const router = Router();

// API v1 routes
router.use('/v1/auth', authRouter);
router.use('/v1/deals', dealRouter);
router.use('/v1/scoring', scoringRouter);
router.use('/v1/thesis', thesisRouter);
router.use('/v1/founders', founderRouter);
router.use('/v1/alerts', alertRouter);
router.use('/v1/portfolio', portfolioRouter);
router.use('/v1/reports', reportRouter);

export default router;
