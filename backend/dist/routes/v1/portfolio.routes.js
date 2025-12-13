"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioRouter = void 0;
const express_1 = require("express");
const portfolio_controller_1 = require("../../controllers/portfolio.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const portfolio_validator_1 = require("../../validators/portfolio.validator");
const portfolioRouter = (0, express_1.Router)();
exports.portfolioRouter = portfolioRouter;
portfolioRouter.use(auth_middleware_1.authMiddleware);
portfolioRouter.get('/', portfolio_controller_1.portfolioController.getPortfolio.bind(portfolio_controller_1.portfolioController));
portfolioRouter.get('/:id', portfolio_controller_1.portfolioController.getPortfolioById.bind(portfolio_controller_1.portfolioController));
portfolioRouter.post('/', portfolio_controller_1.portfolioController.createPortfolioItem.bind(portfolio_controller_1.portfolioController));
portfolioRouter.get('/analytics', portfolio_controller_1.portfolioController.getAnalytics.bind(portfolio_controller_1.portfolioController));
portfolioRouter.get('/:id/performance', portfolio_controller_1.portfolioController.getPerformance.bind(portfolio_controller_1.portfolioController));
portfolioRouter.post('/:id/update', (0, validation_middleware_1.validateRequest)(portfolio_validator_1.updateMetricsValidator), portfolio_controller_1.portfolioController.updateMetrics.bind(portfolio_controller_1.portfolioController));
//# sourceMappingURL=portfolio.routes.js.map