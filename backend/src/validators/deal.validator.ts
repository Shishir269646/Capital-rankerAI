// src/validators/deal.validator.ts
import Joi from 'joi';

/**
 * Create deal validation schema
 */
export const createDealValidator = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    'any.required': 'Startup name is required',
  }),

  description: Joi.string().min(50).max(2000).required().messages({
    'string.min': 'Description must be at least 50 characters',
    'any.required': 'Description is required',
  }),

  short_pitch: Joi.string().max(280).optional(),

  sector: Joi.array()
    .items(
      Joi.string().valid(
        'fintech',
        'healthtech',
        'edtech',
        'e-commerce',
        'saas',
        'ai-ml',
        'blockchain',
        'iot',
        'cybersecurity',
        'climate-tech',
        'agritech',
        'mobility',
        'real-estate',
        'logistics',
        'hr-tech',
        'martech',
        'consumer',
        'enterprise',
        'devtools',
        'other'
      )
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one sector is required',
    }),

  stage: Joi.string()
    .valid('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth')
    .required()
    .messages({
      'any.required': 'Stage is required',
    }),

  funding_history: Joi.array()
    .items(
      Joi.object({
        round_type: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        currency: Joi.string().default('USD'),
        date: Joi.date().required(),
        investors: Joi.array().items(Joi.string()),
        valuation: Joi.number().min(0).optional(),
      })
    )
    .optional(),

  metrics: Joi.object({
    revenue: Joi.number().min(0).default(0),
    arr: Joi.number().min(0).optional(),
    mrr: Joi.number().min(0).optional(),
    growth_rate_mom: Joi.number().default(0),
    growth_rate_yoy: Joi.number().default(0),
    burn_rate: Joi.number().min(0).default(0),
    runway_months: Joi.number().min(0).default(0),
    gross_margin: Joi.number().min(0).max(100).optional(),
    customer_count: Joi.number().min(0).optional(),
    cac: Joi.number().min(0).optional(),
    ltv: Joi.number().min(0).optional(),
  }).optional(),

  team_size: Joi.number().min(1).required().messages({
    'any.required': 'Team size is required',
  }),

  founded_date: Joi.date().max('now').required().messages({
    'date.max': 'Founded date cannot be in the future',
    'any.required': 'Founded date is required',
  }),

  website: Joi.string().uri().required().messages({
    'string.uri': 'Please provide a valid website URL',
    'any.required': 'Website is required',
  }),

  pitch_deck_url: Joi.string().uri().optional(),

  linkedin_url: Joi.string().uri().optional(),

  twitter_url: Joi.string().uri().optional(),

  location: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
    region: Joi.string().optional(),
  }).required(),

  technology_stack: Joi.array().items(Joi.string()).optional(),

  business_model: Joi.string()
    .valid(
      'B2B',
      'B2C',
      'B2B2C',
      'marketplace',
      'subscription',
      'transaction-based',
      'freemium',
      'other'
    )
    .optional(),

  target_market: Joi.string().max(500).optional(),

  competitive_advantage: Joi.string().max(1000).optional(),

  competitors: Joi.array().items(Joi.string()).optional(),

  tags: Joi.array().items(Joi.string()).optional(),
});

/**
 * Update deal validation schema
 */
export const updateDealValidator = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().min(50).max(2000).optional(),
  short_pitch: Joi.string().max(280).optional(),
  sector: Joi.array().items(Joi.string()).min(1).optional(),
  stage: Joi.string()
    .valid('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth')
    .optional(),
  metrics: Joi.object({
    revenue: Joi.number().min(0).optional(),
    arr: Joi.number().min(0).optional(),
    mrr: Joi.number().min(0).optional(),
    growth_rate_mom: Joi.number().optional(),
    growth_rate_yoy: Joi.number().optional(),
    burn_rate: Joi.number().min(0).optional(),
    runway_months: Joi.number().min(0).optional(),
    gross_margin: Joi.number().min(0).max(100).optional(),
    customer_count: Joi.number().min(0).optional(),
  }).optional(),
  team_size: Joi.number().min(1).optional(),
  website: Joi.string().uri().optional(),
  status: Joi.string().valid('active', 'archived', 'rejected', 'invested').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
}).min(1);

/**
 * Add note validation schema
 */
export const addNoteValidator = Joi.object({
  content: Joi.string().min(10).max(5000).required().messages({
    'string.min': 'Note must be at least 10 characters',
    'string.max': 'Note cannot exceed 5000 characters',
    'any.required': 'Note content is required',
  }),
});

/**
 * Search deals validation schema
 */
export const searchDealsValidator = Joi.object({
  query: Joi.string().optional(),
  sectors: Joi.array().items(Joi.string()).optional(),
  stages: Joi.array().items(Joi.string()).optional(),
  min_revenue: Joi.number().min(0).optional(),
  max_revenue: Joi.number().min(0).optional(),
  min_growth_rate: Joi.number().optional(),
  countries: Joi.array().items(Joi.string()).optional(),
  technologies: Joi.array().items(Joi.string()).optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
});

/**
 * Bulk import validation schema
 */
export const bulkImportValidator = Joi.object({
  deals: Joi.array().items(createDealValidator).min(1).max(100).required().messages({
    'array.min': 'At least one deal is required',
    'array.max': 'Cannot import more than 100 deals at once',
  }),
});
