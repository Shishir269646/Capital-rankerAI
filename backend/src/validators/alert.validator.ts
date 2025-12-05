// src/validators/alert.validator.ts
import Joi from 'joi';

/**
 * Configure alerts validation schema
 */
export const configureAlertsValidator = Joi.object({
  alert_types: Joi.array()
    .items(
      Joi.string().valid(
        'competitive_threat',
        'market_shift',
        'portfolio_anomaly',
        'funding_round',
        'regulatory_change',
        'custom'
      )
    )
    .optional(),

  threshold_values: Joi.object({
    min_score_change: Joi.number().min(0).max(100).optional(),
    max_burn_rate: Joi.number().min(0).optional(),
    min_revenue_growth: Joi.number().optional(),
  }).optional(),

  notification_channels: Joi.array()
    .items(Joi.string().valid('email', 'slack', 'teams'))
    .min(1)
    .optional(),
});
