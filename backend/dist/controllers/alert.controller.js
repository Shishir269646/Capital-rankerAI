"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertController = exports.AlertController = void 0;
const alert_service_1 = require("../services/alert.service");
const response_util_1 = require("../utils/response.util");
class AlertController {
    async getAlerts(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const { type, severity, status, page = 1, limit = 20 } = req.query;
            const alerts = await alert_service_1.alertService.getUserAlerts(userId, {
                type: type,
                severity: severity,
                status: status,
                page: Number(page),
                limit: Number(limit),
            });
            res.status(200).json((0, response_util_1.successResponse)('Alerts retrieved', alerts));
        }
        catch (error) {
            next(error);
        }
    }
    async configureAlerts(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const { alert_types, threshold_values, notification_channels } = req.body;
            await alert_service_1.alertService.configureAlerts(userId, {
                alert_types,
                threshold_values,
                notification_channels,
            });
            res.status(200).json((0, response_util_1.successResponse)('Alert preferences configured'));
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const alert = await alert_service_1.alertService.markAsRead(id, userId);
            if (!alert) {
                res.status(404).json((0, response_util_1.errorResponse)('Alert not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('Alert marked as read'));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteAlert(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            await alert_service_1.alertService.deleteAlert(id, userId);
            res.status(200).json((0, response_util_1.successResponse)('Alert deleted'));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AlertController = AlertController;
exports.alertController = new AlertController();
//# sourceMappingURL=alert.controller.js.map