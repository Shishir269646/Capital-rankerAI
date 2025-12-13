"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAlignmentValidator = exports.updateThesisValidator = exports.createThesisValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createThesisValidator = joi_1.default.object({
    title: joi_1.default.string().min(5).max(200).required().messages({
        'string.min': 'Title must be at least 5 characters',
        'any.required': 'Title is required',
    }),
    thesis_text: joi_1.default.string().min(100).max(10000).required().messages({
        'string.min': 'Thesis must be at least 100 characters',
        'string.max': 'Thesis cannot exceed 10000 characters',
        'any.required': 'Thesis text is required',
    }),
    focus_areas: joi_1.default.object({
        sectors: joi_1.default.array()
            .items(joi_1.default.string().valid('fintech', 'healthtech', 'edtech', 'e-commerce', 'saas', 'ai-ml', 'blockchain', 'iot', 'cybersecurity', 'climate-tech', 'agritech', 'mobility', 'real-estate', 'logistics', 'hr-tech', 'martech', 'consumer', 'enterprise', 'devtools', 'other'))
            .min(1)
            .required()
            .messages({
            'array.min': 'At least one sector is required',
        }),
        stages: joi_1.default.array()
            .items(joi_1.default.string().valid('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'))
            .min(1)
            .required()
            .messages({
            'array.min': 'At least one stage is required',
        }),
        geographies: joi_1.default.array().items(joi_1.default.string()).min(1).required().messages({
            'array.min': 'At least one geography is required',
        }),
        business_models: joi_1.default.array()
            .items(joi_1.default.string().valid('B2B', 'B2C', 'B2B2C', 'marketplace', 'subscription', 'transaction-based', 'freemium', 'other'))
            .optional(),
    }).required(),
    investment_criteria: joi_1.default.object({
        min_revenue: joi_1.default.number().min(0).optional(),
        min_growth_rate: joi_1.default.number().optional(),
        min_team_size: joi_1.default.number().min(1).optional(),
        max_burn_rate: joi_1.default.number().min(0).optional(),
        check_size_min: joi_1.default.number().min(0).optional(),
        check_size_max: joi_1.default.number().min(0).optional(),
        must_have_features: joi_1.default.array().items(joi_1.default.string()).optional(),
        deal_breakers: joi_1.default.array().items(joi_1.default.string()).optional(),
    }).optional(),
    key_themes: joi_1.default.array().items(joi_1.default.string()).optional(),
    preferred_technologies: joi_1.default.array().items(joi_1.default.string()).optional(),
    exclusions: joi_1.default.array().items(joi_1.default.string()).optional(),
    target_metrics: joi_1.default.object({
        target_irr: joi_1.default.number().min(0).max(100).optional(),
        target_multiple: joi_1.default.number().min(1).optional(),
        investment_horizon_years: joi_1.default.number().min(1).max(20).optional(),
    }).optional(),
    examples: joi_1.default.object({
        positive_examples: joi_1.default.array().items(joi_1.default.string()).optional(),
        negative_examples: joi_1.default.array().items(joi_1.default.string()).optional(),
    }).optional(),
});
exports.updateThesisValidator = joi_1.default.object({
    title: joi_1.default.string().min(5).max(200).optional(),
    thesis_text: joi_1.default.string().min(100).max(10000).optional(),
    focus_areas: joi_1.default.object({
        sectors: joi_1.default.array().items(joi_1.default.string()).min(1).optional(),
        stages: joi_1.default.array().items(joi_1.default.string()).min(1).optional(),
        geographies: joi_1.default.array().items(joi_1.default.string()).min(1).optional(),
        business_models: joi_1.default.array().items(joi_1.default.string()).optional(),
    }).optional(),
    investment_criteria: joi_1.default.object().optional(),
    key_themes: joi_1.default.array().items(joi_1.default.string()).optional(),
    is_active: joi_1.default.boolean().optional(),
}).min(1);
exports.analyzeAlignmentValidator = joi_1.default.object({
    thesis_id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid thesis ID format',
        'any.required': 'Thesis ID is required',
    }),
    deal_id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid deal ID format',
        'any.required': 'Deal ID is required',
    }),
});
//# sourceMappingURL=thesis.validator.js.map