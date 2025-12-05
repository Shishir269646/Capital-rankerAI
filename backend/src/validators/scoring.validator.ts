// src/validators/scoring.validator.ts
import Joi from 'joi';

/**
 * Batch score validation schema
 */
export const batchScoreValidator = Joi.object({
  deal_ids: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one deal ID is required',
      'array.max': 'Cannot score more than 50 deals at once',
      'string.pattern.base': 'Invalid deal ID format',
    }),
});

/**
 * Compare scores validation schema
 */
export const compareScoresValidator = Joi.object({
  deal_ids: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(2)
    .max(10)
    .required()
    .messages({
      'array.min': 'At least 2 deal IDs are required for comparison',
      'array.max': 'Cannot compare more than 10 deals at once',
    }),
});
