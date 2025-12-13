"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealController = exports.DealController = void 0;
const deal_service_1 = require("../services/deal.service");
const response_util_1 = require("../utils/response.util");
const ActivityLog_1 = __importDefault(require("../model/ActivityLog"));
class DealController {
    async getAllDeals(req, res, next) {
        try {
            const { page = 1, limit = 20, sector, stage, status, score_min, score_max, country, search, sort_by = 'created_at', sort_order = 'desc', } = req.query;
            const filters = {};
            if (sector) {
                filters.sector = Array.isArray(sector) ? { $in: sector } : sector;
            }
            if (stage) {
                filters.stage = stage;
            }
            if (status) {
                filters.status = status;
            }
            if (country) {
                filters['location.country'] = country;
            }
            if (search) {
                filters.$text = { $search: search };
            }
            const result = await deal_service_1.dealService.getAllDeals({
                page: Number(page),
                limit: Number(limit),
                filters,
                sortBy: sort_by,
                sortOrder: sort_order,
                scoreMin: score_min ? Number(score_min) : undefined,
                scoreMax: score_max ? Number(score_max) : undefined,
            });
            res.status(200).json((0, response_util_1.successResponse)('Deals retrieved successfully', result));
        }
        catch (error) {
            next(error);
        }
    }
    async getDealById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const deal = await deal_service_1.dealService.getDealById(id);
            if (!deal) {
                res.status(404).json((0, response_util_1.errorResponse)('Deal not found', 404));
                return;
            }
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'view',
                entity_type: 'startup',
                entity_id: deal._id,
                ip_address: req.ip,
            });
            res.status(200).json((0, response_util_1.successResponse)('Deal retrieved successfully', { deal }));
        }
        catch (error) {
            next(error);
        }
    }
    async createDeal(req, res, next) {
        try {
            const userId = req.user?.userId;
            const dealData = {
                ...req.body,
                source: 'manual',
            };
            const deal = await deal_service_1.dealService.createDeal(dealData);
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'create',
                entity_type: 'startup',
                entity_id: deal._id,
                details: { name: deal.name, sector: deal.sector },
                ip_address: req.ip,
            });
            res.status(201).json((0, response_util_1.successResponse)('Deal created successfully', { deal }, 201));
        }
        catch (error) {
            next(error);
        }
    }
    async updateDeal(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const updateData = req.body;
            const deal = await deal_service_1.dealService.updateDeal(id, updateData);
            if (!deal) {
                res.status(404).json((0, response_util_1.errorResponse)('Deal not found', 404));
                return;
            }
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'update',
                entity_type: 'startup',
                entity_id: deal._id,
                details: { updated_fields: Object.keys(updateData) },
                ip_address: req.ip,
            });
            res.status(200).json((0, response_util_1.successResponse)('Deal updated successfully', { deal }));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteDeal(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const deal = await deal_service_1.dealService.updateDeal(id, { status: 'archived' });
            if (!deal) {
                res.status(404).json((0, response_util_1.errorResponse)('Deal not found', 404));
                return;
            }
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'delete',
                entity_type: 'startup',
                entity_id: deal._id,
                ip_address: req.ip,
            });
            res.status(200).json((0, response_util_1.successResponse)('Deal archived successfully'));
        }
        catch (error) {
            next(error);
        }
    }
    async addNote(req, res, next) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const deal = await deal_service_1.dealService.addNote(id, userId, content);
            if (!deal) {
                res.status(404).json((0, response_util_1.errorResponse)('Deal not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Note added successfully', { notes: deal.notes }));
        }
        catch (error) {
            next(error);
        }
    }
    async getDealStats(_req, res, next) {
        try {
            const stats = await deal_service_1.dealService.getDealStatistics();
            res.status(200).json((0, response_util_1.successResponse)('Deal statistics retrieved', stats));
        }
        catch (error) {
            next(error);
        }
    }
    async searchDeals(req, res, next) {
        try {
            const { query, sectors, stages, min_revenue, max_revenue, min_growth_rate, countries, technologies, page = 1, limit = 20, } = req.body;
            const results = await deal_service_1.dealService.advancedSearch({
                query,
                sectors,
                stages,
                minRevenue: min_revenue,
                maxRevenue: max_revenue,
                minGrowthRate: min_growth_rate,
                countries,
                technologies,
                page: Number(page),
                limit: Number(limit),
            });
            res.status(200).json((0, response_util_1.successResponse)('Search completed', results));
        }
        catch (error) {
            next(error);
        }
    }
    async getTopRankedDeals(req, res, next) {
        try {
            const { limit = 10 } = req.query;
            const deals = await deal_service_1.dealService.getTopRankedDeals(Number(limit));
            res.status(200).json((0, response_util_1.successResponse)('Top ranked deals retrieved', { deals }));
        }
        catch (error) {
            next(error);
        }
    }
    async getSimilarDeals(req, res, next) {
        try {
            const { id } = req.params;
            const { limit = 5 } = req.query;
            const similarDeals = await deal_service_1.dealService.getSimilarDeals(id, Number(limit));
            res.status(200).json((0, response_util_1.successResponse)('Similar deals retrieved', { deals: similarDeals }));
        }
        catch (error) {
            next(error);
        }
    }
    async bulkImport(req, res, next) {
        try {
            const { deals } = req.body;
            const userId = req.user?.userId;
            if (!Array.isArray(deals) || deals.length === 0) {
                res.status(400).json((0, response_util_1.errorResponse)('Deals array is required', 400));
                return;
            }
            const result = await deal_service_1.dealService.bulkCreateDeals(deals);
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'create',
                entity_type: 'startup',
                details: { count: result.created, failed: result.failed },
                ip_address: req.ip,
            });
            res.status(200).json((0, response_util_1.successResponse)('Bulk import completed', result));
        }
        catch (error) {
            next(error);
        }
    }
    async exportDeals(req, res, next) {
        try {
            const { format = 'csv', filters } = req.query;
            const fileBuffer = await deal_service_1.dealService.exportDeals(format, filters ? JSON.parse(filters) : {});
            const fileName = `deals_export_${Date.now()}.${format}`;
            const mimeType = format === 'csv'
                ? 'text/csv'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.send(fileBuffer);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DealController = DealController;
exports.dealController = new DealController();
//# sourceMappingURL=deal.controller.js.map