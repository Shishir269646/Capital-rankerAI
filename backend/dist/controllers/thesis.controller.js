"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.thesisController = exports.ThesisController = void 0;
const thesis_service_1 = require("../services/thesis.service");
const response_util_1 = require("../utils/response.util");
const ActivityLog_1 = __importDefault(require("../model/ActivityLog"));
class ThesisController {
    async createThesis(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const thesisData = {
                ...req.body,
                investor_id: userId,
            };
            const thesis = await thesis_service_1.thesisService.createThesis(thesisData);
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'create',
                entity_type: 'thesis',
                entity_id: thesis._id,
                ip_address: req.ip,
            });
            res.status(201).json((0, response_util_1.successResponse)('Thesis created successfully', { thesis }, 201));
        }
        catch (error) {
            next(error);
        }
    }
    async updateThesis(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const updateData = req.body;
            const thesis = await thesis_service_1.thesisService.updateThesis(id, userId, updateData);
            if (!thesis) {
                res.status(404).json((0, response_util_1.errorResponse)('Thesis not found or unauthorized', 404));
                return;
            }
            await thesis_service_1.thesisService.triggerReMatching(thesis._id);
            res.status(200).json((0, response_util_1.successResponse)('Thesis updated successfully', { thesis }));
        }
        catch (error) {
            next(error);
        }
    }
    async getInvestorThesisById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const thesis = await thesis_service_1.thesisService.getInvestorThesisById(id, userId);
            if (!thesis) {
                res.status(404).json((0, response_util_1.errorResponse)('Investor Thesis not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Investor Thesis retrieved', thesis));
        }
        catch (error) {
            next(error);
        }
    }
    async getThesisMatches(req, res, next) {
        try {
            const { dealId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const matches = await thesis_service_1.thesisService.matchDealWithThesis(dealId, userId);
            res.status(200).json((0, response_util_1.successResponse)('Thesis matches retrieved', matches));
        }
        catch (error) {
            next(error);
        }
    }
    async getInvestorMatches(req, res, next) {
        try {
            const { investorId } = req.params;
            const { limit = 20, min_score = 60 } = req.query;
            const matches = await thesis_service_1.thesisService.getTopMatchesForInvestor(investorId, Number(limit), Number(min_score));
            res.status(200).json((0, response_util_1.successResponse)('Top matches retrieved', matches));
        }
        catch (error) {
            next(error);
        }
    }
    async getInvestorTheses(req, res, next) {
        try {
            const { investorId } = req.params;
            const { include_inactive = false } = req.query;
            const theses = await thesis_service_1.thesisService.getInvestorTheses(investorId, include_inactive === 'true');
            res.status(200).json((0, response_util_1.successResponse)('Theses retrieved', { theses }));
        }
        catch (error) {
            next(error);
        }
    }
    async analyzeAlignment(req, res, next) {
        try {
            const { thesis_id, deal_id } = req.body;
            const analysis = await thesis_service_1.thesisService.analyzeThesisDealAlignment(thesis_id, deal_id);
            res.status(200).json((0, response_util_1.successResponse)('Alignment analysis completed', analysis));
        }
        catch (error) {
            next(error);
        }
    }
    async deactivateThesis(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const thesis = await thesis_service_1.thesisService.deactivateThesis(id, userId);
            if (!thesis) {
                res.status(404).json((0, response_util_1.errorResponse)('Thesis not found or unauthorized', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Thesis deactivated successfully'));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ThesisController = ThesisController;
exports.thesisController = new ThesisController();
//# sourceMappingURL=thesis.controller.js.map