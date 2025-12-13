"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioController = exports.PortfolioController = void 0;
const portfolio_service_1 = require("../services/portfolio.service");
const response_util_1 = require("../utils/response.util");
class PortfolioController {
    async getPortfolio(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const { status, page = 1, limit = 20 } = req.query;
            const portfolio = await portfolio_service_1.portfolioService.getPortfolio(userId, {
                status: status,
                page: Number(page),
                limit: Number(limit),
            });
            res.status(200).json((0, response_util_1.successResponse)('Portfolio retrieved', portfolio));
        }
        catch (error) {
            next(error);
        }
    }
    async getPerformance(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const performance = await portfolio_service_1.portfolioService.getPortfolioPerformance(id, userId);
            if (!performance) {
                res.status(404).json((0, response_util_1.errorResponse)('Portfolio company not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Performance data retrieved', performance));
        }
        catch (error) {
            next(error);
        }
    }
    async updateMetrics(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const metrics = req.body;
            const updated = await portfolio_service_1.portfolioService.updatePortfolioMetrics(id, userId, metrics);
            if (!updated) {
                res.status(404).json((0, response_util_1.errorResponse)('Portfolio company not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Metrics updated', { portfolio: updated }));
        }
        catch (error) {
            next(error);
        }
    }
    async getAnalytics(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const analytics = await portfolio_service_1.portfolioService.getPortfolioAnalytics(userId);
            res.status(200).json((0, response_util_1.successResponse)('Analytics retrieved', analytics));
        }
        catch (error) {
            next(error);
        }
    }
    async getPortfolioById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const portfolioItem = await portfolio_service_1.portfolioService.getPortfolioItemById(id, userId);
            if (!portfolioItem) {
                res.status(404).json((0, response_util_1.errorResponse)('Portfolio company not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Portfolio company retrieved', portfolioItem));
        }
        catch (error) {
            next(error);
        }
    }
    async createPortfolioItem(req, res, next) {
        try {
            const { startup_id } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            if (!startup_id) {
                return next((0, response_util_1.errorResponse)('Startup ID is required', 400));
            }
            const portfolioItem = await portfolio_service_1.portfolioService.createPortfolioItem(startup_id, userId);
            res.status(201).json((0, response_util_1.successResponse)('Portfolio item created successfully', portfolioItem, 201));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PortfolioController = PortfolioController;
exports.portfolioController = new PortfolioController();
//# sourceMappingURL=portfolio.controller.js.map