"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMetricsValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateMetricsValidator = joi_1.default.object({
    last_reported_revenue: joi_1.default.number().min(0).optional(),
    last_reported_arr: joi_1.default.number().min(0).optional(),
    last_reported_growth_rate: joi_1.default.number().optional(),
    last_reported_burn_rate: joi_1.default.number().min(0).optional(),
    last_reported_runway: joi_1.default.number().min(0).optional(),
    last_update_date: joi_1.default.date().optional(),
}).min(1);
//# sourceMappingURL=portfolio.validator.js.map