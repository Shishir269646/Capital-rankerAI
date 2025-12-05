// src/validators/report.validator.ts
import Joi from 'joi';

/**
 * Generate report validation schema
 */
export const generateReportValidator = Joi.object({
  report_type: Joi.string()
    .valid(
      'deal_analysis',
      'portfolio_summary',
      'performance_tracking',
      'investment_thesis',
      'custom'
    )
    .required()
    .messages({
      'any.required': 'Report type is required',
      'any.only': 'Invalid report type',
    }),

  filters: Joi.object({
    deal_ids: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional(),
    sectors: Joi.array().items(Joi.string()).optional(),
    stages: Joi.array().items(Joi.string()).optional(),
    date_range: Joi.object({
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
    }).optional(),
  }).optional(),

  date_range: Joi.object({
    start_date: Joi.date().max('now').optional(),
    end_date: Joi.date().max('now').min(Joi.ref('start_date')).optional().messages({
      'date.min': 'End date must be after start date',
    }),
  }).optional(),

  format: Joi.string().valid('pdf', 'excel', 'csv').default('pdf').optional(),

  include_charts: Joi.boolean().default(true).optional(),

  include_recommendations: Joi.boolean().default(true).optional(),
});
