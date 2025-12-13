"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.founderController = exports.FounderController = void 0;
const founder_service_1 = require("../services/founder.service");
const response_util_1 = require("../utils/response.util");
const ActivityLog_1 = __importDefault(require("../model/ActivityLog"));
class FounderController {
    async evaluateFounder(req, res, next) {
        try {
            const { founderId } = req.params;
            const userId = req.user?.userId;
            const evaluation = await founder_service_1.founderService.evaluateFounder(founderId);
            if (!evaluation) {
                res.status(404).json((0, response_util_1.errorResponse)('Founder not found or evaluation failed', 404));
                return;
            }
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'founder_evaluated',
                entity_type: 'founder',
                entity_id: founderId,
                details: { score: evaluation.founder_score?.overall_score },
                ip_address: req.ip,
            });
            res.status(200).json((0, response_util_1.successResponse)('Founder evaluated successfully', { evaluation }));
        }
        catch (error) {
            next(error);
        }
    }
    async getFounderProfile(req, res, next) {
        try {
            const { id } = req.params;
            const founder = await founder_service_1.founderService.getFounderById(id);
            if (!founder) {
                res.status(404).json((0, response_util_1.errorResponse)('Founder not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Founder profile retrieved', { founder }));
        }
        catch (error) {
            next(error);
        }
    }
    async updateFounder(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = req.user?.userId;
            const founder = await founder_service_1.founderService.updateFounder(id, updateData);
            if (!founder) {
                res.status(404).json((0, response_util_1.errorResponse)('Founder not found', 404));
                return;
            }
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'update',
                entity_type: 'founder',
                entity_id: founder._id,
                ip_address: req.ip,
            });
            res.status(200).json((0, response_util_1.successResponse)('Founder updated successfully', { founder }));
        }
        catch (error) {
            next(error);
        }
    }
    async getFoundersByStartup(req, res, next) {
        try {
            const { startupId } = req.params;
            const founders = await founder_service_1.founderService.getFoundersByStartup(startupId);
            res.status(200).json((0, response_util_1.successResponse)('Founders retrieved', { founders }));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FounderController = FounderController;
exports.founderController = new FounderController();
//# sourceMappingURL=founder.controller.js.map