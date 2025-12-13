"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAlertsValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.configureAlertsValidator = joi_1.default.object({
    alert_types: joi_1.default.array()
        .items(joi_1.default.string().valid('competitive_threat', 'market_shift', 'portfolio_anomaly', 'funding_round', 'regulatory_change', 'custom'))
        .optional(),
    threshold_values: joi_1.default.object({
        min_score_change: joi_1.default.number().min(0).max(100).optional(),
        max_burn_rate: joi_1.default.number().min(0).optional(),
        min_revenue_growth: joi_1.default.number().optional(),
    }).optional(),
    notification_channels: joi_1.default.array()
        .items(joi_1.default.string().valid('email', 'slack', 'teams'))
        .min(1)
        .optional(),
});
//# sourceMappingURL=alert.validator.js.map