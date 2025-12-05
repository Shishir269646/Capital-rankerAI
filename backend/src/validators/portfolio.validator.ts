// src/validators/portfolio.validator.ts
import Joi from 'joi';

/**
 * Update metrics validation schema
 */
export const updateMetricsValidator = Joi.object({
  last_reported_revenue: Joi.number().min(0).optional(),
  last_reported_arr: Joi.number().min(0).optional(),
  last_reported_growth_rate: Joi.number().optional(),
  last_reported_burn_rate: Joi.number().min(0).optional(),
  last_reported_runway: Joi.number().min(0).optional(),
  last_update_date: Joi.date().optional(),
}).min(1);
