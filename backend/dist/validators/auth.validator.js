"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferencesValidator = exports.changePasswordValidator = exports.refreshTokenValidator = exports.loginValidator = exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerValidator = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string()
        .min(8)
        .max(128)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
        'any.required': 'Password is required',
    }),
    name: joi_1.default.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required',
    }),
    firm_name: joi_1.default.string().min(2).max(200).required().messages({
        'string.min': 'Firm name must be at least 2 characters',
        'string.max': 'Firm name cannot exceed 200 characters',
        'any.required': 'Firm name is required',
    }),
    role: joi_1.default.string().valid('admin', 'investor', 'analyst').default('analyst').messages({
        'any.only': 'Role must be admin, investor, or analyst',
    }),
    phone: joi_1.default.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .optional()
        .messages({
        'string.pattern.base': 'Please provide a valid phone number',
    }),
    linkedin_url: joi_1.default.string().uri().optional().messages({
        'string.uri': 'Please provide a valid LinkedIn URL',
    }),
});
exports.loginValidator = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required',
    }),
});
exports.refreshTokenValidator = joi_1.default.object({
    refresh_token: joi_1.default.string().required().messages({
        'any.required': 'Refresh token is required',
    }),
});
exports.changePasswordValidator = joi_1.default.object({
    current_password: joi_1.default.string().required().messages({
        'any.required': 'Current password is required',
    }),
    new_password: joi_1.default.string()
        .min(8)
        .max(128)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.pattern.base': 'New password must contain uppercase, lowercase, number, and special character',
        'any.required': 'New password is required',
    }),
});
exports.updatePreferencesValidator = joi_1.default.object({
    notification_channels: joi_1.default.array()
        .items(joi_1.default.string().valid('email', 'slack', 'teams'))
        .optional(),
    alert_types: joi_1.default.array().items(joi_1.default.string()).optional(),
    dashboard_layout: joi_1.default.object().optional(),
    scoring_weights: joi_1.default.object({
        market_weight: joi_1.default.number().min(0).max(1).optional(),
        traction_weight: joi_1.default.number().min(0).max(1).optional(),
        team_weight: joi_1.default.number().min(0).max(1).optional(),
        financial_weight: joi_1.default.number().min(0).max(1).optional(),
    }).optional(),
});
//# sourceMappingURL=auth.validator.js.map