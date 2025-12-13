"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertService = exports.AlertService = void 0;
const Alert_1 = __importDefault(require("../model/Alert"));
const notification_service_1 = require("./notification.service");
const User_1 = __importDefault(require("../model/User"));
class AlertService {
    async getUserAlerts(userId, filters) {
        const { type, severity, status, page, limit } = filters;
        const query = { user_id: userId };
        if (type)
            query.type = type;
        if (severity)
            query.severity = severity;
        if (status)
            query.status = status;
        const skip = (page - 1) * limit;
        const alerts = await Alert_1.default.find(query).sort({ triggered_at: -1 }).skip(skip).limit(limit);
        const total = await Alert_1.default.countDocuments(query);
        return {
            alerts,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async configureAlerts(userId, config) {
        await User_1.default.findByIdAndUpdate(userId, {
            $set: {
                'preferences.alert_types': config.alert_types,
                'preferences.threshold_values': config.threshold_values,
                'preferences.notification_channels': config.notification_channels,
            },
        }, { new: true, runValidators: true });
    }
    async markAsRead(alertId, userId) {
        return await Alert_1.default.findOneAndUpdate({ _id: alertId, user_id: userId }, { status: 'read', read_at: new Date() }, { new: true });
    }
    async deleteAlert(alertId, userId) {
        await Alert_1.default.findOneAndUpdate({ _id: alertId, user_id: userId }, { status: 'archived' });
    }
    async createAlert(alertData) {
        const alert = new Alert_1.default(alertData);
        await alert.save();
        await notification_service_1.notificationService.sendAlertNotification(alertData.user_id, alert);
    }
}
exports.AlertService = AlertService;
exports.alertService = new AlertService();
//# sourceMappingURL=alert.service.js.map