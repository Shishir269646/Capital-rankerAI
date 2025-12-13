"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFounderValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateFounderValidator = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string().valid('ceo', 'cto', 'coo', 'cfo', 'co-founder', 'founder').optional(),
    profile: joi_1.default.object({
        bio: joi_1.default.string().max(2000).optional(),
        linkedin_url: joi_1.default.string().uri().optional(),
        twitter_url: joi_1.default.string().uri().optional(),
        github_url: joi_1.default.string().uri().optional(),
        profile_picture: joi_1.default.string().uri().optional(),
    }).optional(),
    education: joi_1.default.array()
        .items(joi_1.default.object({
        institution: joi_1.default.string().required(),
        degree: joi_1.default.string()
            .valid('high-school', 'bachelor', 'master', 'phd', 'mba', 'other')
            .required(),
        field_of_study: joi_1.default.string().required(),
        start_year: joi_1.default.number().min(1950).max(new Date().getFullYear()).required(),
        end_year: joi_1.default.number()
            .min(1950)
            .max(new Date().getFullYear() + 10)
            .optional(),
        is_graduated: joi_1.default.boolean().default(true),
    }))
        .optional(),
    experience: joi_1.default.array()
        .items(joi_1.default.object({
        company: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().max(1000).optional(),
        start_date: joi_1.default.date().required(),
        end_date: joi_1.default.date().optional(),
        is_current: joi_1.default.boolean().default(false),
        achievements: joi_1.default.array().items(joi_1.default.string()).optional(),
    }))
        .optional(),
    skills: joi_1.default.object({
        technical_skills: joi_1.default.array().items(joi_1.default.string()).optional(),
        domain_expertise: joi_1.default.array().items(joi_1.default.string()).optional(),
        leadership_experience: joi_1.default.boolean().optional(),
        years_of_experience: joi_1.default.number().min(0).optional(),
    }).optional(),
    achievements: joi_1.default.array().items(joi_1.default.string()).optional(),
    publications: joi_1.default.array().items(joi_1.default.string()).optional(),
    patents: joi_1.default.array().items(joi_1.default.string()).optional(),
    awards: joi_1.default.array().items(joi_1.default.string()).optional(),
}).min(1);
//# sourceMappingURL=founder.validator.js.map