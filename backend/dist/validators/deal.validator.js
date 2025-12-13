"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkImportValidator = exports.searchDealsValidator = exports.addNoteValidator = exports.updateDealValidator = exports.createDealValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDealValidator = joi_1.default.object({
    name: joi_1.default.string().min(2).max(200).required().messages({
        'any.required': 'Startup name is required',
    }),
    description: joi_1.default.string().min(50).max(2000).required().messages({
        'string.min': 'Description must be at least 50 characters',
        'any.required': 'Description is required',
    }),
    short_pitch: joi_1.default.string().max(280).optional(),
    sector: joi_1.default.array()
        .items(joi_1.default.string().valid('fintech', 'healthtech', 'edtech', 'e-commerce', 'saas', 'ai-ml', 'blockchain', 'iot', 'cybersecurity', 'climate-tech', 'agritech', 'mobility', 'real-estate', 'logistics', 'hr-tech', 'martech', 'consumer', 'enterprise', 'devtools', 'other'))
        .min(1)
        .required()
        .messages({
        'array.min': 'At least one sector is required',
    }),
    stage: joi_1.default.string()
        .valid('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth')
        .required()
        .messages({
        'any.required': 'Stage is required',
    }),
    funding_history: joi_1.default.array()
        .items(joi_1.default.object({
        round_type: joi_1.default.string().required(),
        amount: joi_1.default.number().min(0).required(),
        currency: joi_1.default.string().default('USD'),
        date: joi_1.default.date().required(),
        investors: joi_1.default.array().items(joi_1.default.string()),
        valuation: joi_1.default.number().min(0).optional(),
    }))
        .optional(),
    metrics: joi_1.default.object({
        revenue: joi_1.default.number().min(0).default(0),
        arr: joi_1.default.number().min(0).optional(),
        mrr: joi_1.default.number().min(0).optional(),
        growth_rate_mom: joi_1.default.number().default(0),
        growth_rate_yoy: joi_1.default.number().default(0),
        burn_rate: joi_1.default.number().min(0).default(0),
        runway_months: joi_1.default.number().min(0).default(0),
        gross_margin: joi_1.default.number().min(0).max(100).optional(),
        customer_count: joi_1.default.number().min(0).optional(),
        cac: joi_1.default.number().min(0).optional(),
        ltv: joi_1.default.number().min(0).optional(),
    }).optional(),
    team_size: joi_1.default.number().min(1).required().messages({
        'any.required': 'Team size is required',
    }),
    founded_date: joi_1.default.date().max('now').required().messages({
        'date.max': 'Founded date cannot be in the future',
        'any.required': 'Founded date is required',
    }),
    website: joi_1.default.string().uri().required().messages({
        'string.uri': 'Please provide a valid website URL',
        'any.required': 'Website is required',
    }),
    pitch_deck_url: joi_1.default.string().uri().optional(),
    linkedin_url: joi_1.default.string().uri().optional(),
    twitter_url: joi_1.default.string().uri().optional(),
    location: joi_1.default.object({
        city: joi_1.default.string().required(),
        country: joi_1.default.string().required(),
        region: joi_1.default.string().optional(),
    }).required(),
    technology_stack: joi_1.default.array().items(joi_1.default.string()).optional(),
    business_model: joi_1.default.string()
        .valid('B2B', 'B2C', 'B2B2C', 'marketplace', 'subscription', 'transaction-based', 'freemium', 'other')
        .optional(),
    target_market: joi_1.default.string().max(500).optional(),
    competitive_advantage: joi_1.default.string().max(1000).optional(),
    competitors: joi_1.default.array().items(joi_1.default.string()).optional(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
});
exports.updateDealValidator = joi_1.default.object({
    name: joi_1.default.string().min(2).max(200).optional(),
    description: joi_1.default.string().min(50).max(2000).optional(),
    short_pitch: joi_1.default.string().max(280).optional(),
    sector: joi_1.default.array().items(joi_1.default.string()).min(1).optional(),
    stage: joi_1.default.string()
        .valid('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth')
        .optional(),
    metrics: joi_1.default.object({
        revenue: joi_1.default.number().min(0).optional(),
        arr: joi_1.default.number().min(0).optional(),
        mrr: joi_1.default.number().min(0).optional(),
        growth_rate_mom: joi_1.default.number().optional(),
        growth_rate_yoy: joi_1.default.number().optional(),
        burn_rate: joi_1.default.number().min(0).optional(),
        runway_months: joi_1.default.number().min(0).optional(),
        gross_margin: joi_1.default.number().min(0).max(100).optional(),
        customer_count: joi_1.default.number().min(0).optional(),
    }).optional(),
    team_size: joi_1.default.number().min(1).optional(),
    website: joi_1.default.string().uri().optional(),
    status: joi_1.default.string().valid('active', 'archived', 'rejected', 'invested').optional(),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
}).min(1);
exports.addNoteValidator = joi_1.default.object({
    content: joi_1.default.string().min(10).max(5000).required().messages({
        'string.min': 'Note must be at least 10 characters',
        'string.max': 'Note cannot exceed 5000 characters',
        'any.required': 'Note content is required',
    }),
});
exports.searchDealsValidator = joi_1.default.object({
    query: joi_1.default.string().optional(),
    sectors: joi_1.default.array().items(joi_1.default.string()).optional(),
    stages: joi_1.default.array().items(joi_1.default.string()).optional(),
    min_revenue: joi_1.default.number().min(0).optional(),
    max_revenue: joi_1.default.number().min(0).optional(),
    min_growth_rate: joi_1.default.number().optional(),
    countries: joi_1.default.array().items(joi_1.default.string()).optional(),
    technologies: joi_1.default.array().items(joi_1.default.string()).optional(),
    page: joi_1.default.number().min(1).default(1),
    limit: joi_1.default.number().min(1).max(100).default(20),
});
exports.bulkImportValidator = joi_1.default.object({
    deals: joi_1.default.array().items(exports.createDealValidator).min(1).max(100).required().messages({
        'array.min': 'At least one deal is required',
        'array.max': 'Cannot import more than 100 deals at once',
    }),
});
//# sourceMappingURL=deal.validator.js.map