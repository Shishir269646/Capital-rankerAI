"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.generateReportValidator = joi_1.default.object({
    report_type: joi_1.default.string()
        .valid('deal_analysis', 'portfolio_summary', 'performance_tracking', 'investment_thesis', 'custom')
        .required()
        .messages({
        'any.required': 'Report type is required',
        'any.only': 'Invalid report type',
    }),
    filters: joi_1.default.object({
        deal_ids: joi_1.default.array()
            .items(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/))
            .optional(),
        sectors: joi_1.default.array().items(joi_1.default.string()).optional(),
        stages: joi_1.default.array().items(joi_1.default.string()).optional(),
        date_range: joi_1.default.object({
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
        }).optional(),
    }).optional(),
    date_range: joi_1.default.object({
        start_date: joi_1.default.date().max('now').optional(),
        end_date: joi_1.default.date().max('now').min(joi_1.default.ref('start_date')).optional().messages({
            'date.min': 'End date must be after start date',
        }),
    }).optional(),
    format: joi_1.default.string().valid('pdf', 'excel', 'csv').default('pdf').optional(),
    include_charts: joi_1.default.boolean().default(true).optional(),
    include_recommendations: joi_1.default.boolean().default(true).optional(),
});
//# sourceMappingURL=report.validator.js.map