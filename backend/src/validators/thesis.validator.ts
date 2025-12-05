// src/validators/thesis.validator.ts
import Joi from 'joi';

/**
 * Create thesis validation schema
 */
export const createThesisValidator = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Title must be at least 5 characters',
    'any.required': 'Title is required',
  }),

  thesis_text: Joi.string().min(100).max(10000).required().messages({
    'string.min': 'Thesis must be at least 100 characters',
    'string.max': 'Thesis cannot exceed 10000 characters',
    'any.required': 'Thesis text is required',
  }),

  focus_areas: Joi.object({
    sectors: Joi.array()
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

    stages: Joi.array()
      .items(Joi.string().valid('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'))
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one stage is required',
      }),

    geographies: Joi.array().items(Joi.string()).min(1).required().messages({
      'array.min': 'At least one geography is required',
    }),

    business_models: Joi.array()
      .items(
        Joi.string().valid(
          'B2B',
          'B2C',
          'B2B2C',
          'marketplace',
          'subscription',
          'transaction-based',
          'freemium',
          'other'
        )
      )
      .optional(),
  }).required(),

  investment_criteria: Joi.object({
    min_revenue: Joi.number().min(0).optional(),
    min_growth_rate: Joi.number().optional(),
    min_team_size: Joi.number().min(1).optional(),
    max_burn_rate: Joi.number().min(0).optional(),
    check_size_min: Joi.number().min(0).optional(),
    check_size_max: Joi.number().min(0).optional(),
    must_have_features: Joi.array().items(Joi.string()).optional(),
    deal_breakers: Joi.array().items(Joi.string()).optional(),
  }).optional(),

  key_themes: Joi.array().items(Joi.string()).optional(),

  preferred_technologies: Joi.array().items(Joi.string()).optional(),

  exclusions: Joi.array().items(Joi.string()).optional(),

  target_metrics: Joi.object({
    target_irr: Joi.number().min(0).max(100).optional(),
    target_multiple: Joi.number().min(1).optional(),
    investment_horizon_years: Joi.number().min(1).max(20).optional(),
  }).optional(),

  examples: Joi.object({
    positive_examples: Joi.array().items(Joi.string()).optional(),
    negative_examples: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});

/**
 * Update thesis validation schema
 */
export const updateThesisValidator = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  thesis_text: Joi.string().min(100).max(10000).optional(),
  focus_areas: Joi.object({
    sectors: Joi.array().items(Joi.string()).min(1).optional(),
    stages: Joi.array().items(Joi.string()).min(1).optional(),
    geographies: Joi.array().items(Joi.string()).min(1).optional(),
    business_models: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  investment_criteria: Joi.object().optional(),
  key_themes: Joi.array().items(Joi.string()).optional(),
  is_active: Joi.boolean().optional(),
}).min(1);

/**
 * Analyze alignment validation schema
 */
export const analyzeAlignmentValidator = Joi.object({
  thesis_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid thesis ID format',
      'any.required': 'Thesis ID is required',
    }),

  deal_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid deal ID format',
      'any.required': 'Deal ID is required',
    }),
});
