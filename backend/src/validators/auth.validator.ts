// src/validators/auth.validator.ts
import Joi from 'joi';

/**
 * Register validation schema
 */
export const registerValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Password is required',
    }),

  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),

  firm_name: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Firm name must be at least 2 characters',
    'string.max': 'Firm name cannot exceed 200 characters',
    'any.required': 'Firm name is required',
  }),

  role: Joi.string().valid('admin', 'investor', 'analyst').default('analyst').messages({
    'any.only': 'Role must be admin, investor, or analyst',
  }),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),

  linkedin_url: Joi.string().uri().optional().messages({
    'string.uri': 'Please provide a valid LinkedIn URL',
  }),
});

/**
 * Login validation schema
 */
export const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenValidator = Joi.object({
  refresh_token: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

/**
 * Change password validation schema
 */
export const changePasswordValidator = Joi.object({
  current_password: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),

  new_password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base':
        'New password must contain uppercase, lowercase, number, and special character',
      'any.required': 'New password is required',
    }),
});

/**
 * Update preferences validation schema
 */
export const updatePreferencesValidator = Joi.object({
  notification_channels: Joi.array()
    .items(Joi.string().valid('email', 'slack', 'teams'))
    .optional(),

  alert_types: Joi.array().items(Joi.string()).optional(),

  dashboard_layout: Joi.object().optional(),

  scoring_weights: Joi.object({
    market_weight: Joi.number().min(0).max(1).optional(),
    traction_weight: Joi.number().min(0).max(1).optional(),
    team_weight: Joi.number().min(0).max(1).optional(),
    financial_weight: Joi.number().min(0).max(1).optional(),
  }).optional(),
});
