// src/validators/founder.validator.ts
import Joi from 'joi';

/**
 * Create founder validation schema
 */
const createFounder = Joi.object({
  fullName: Joi.string().required(),
  startupId: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('ceo', 'cto', 'coo', 'cfo', 'co-founder', 'founder').required(),

  profile: Joi.object({
    bio: Joi.string().max(2000).optional(),
    linkedin_url: Joi.string().uri().optional(),
    twitter_url: Joi.string().uri().optional(),
    github_url: Joi.string().uri().optional(),
    profile_picture: Joi.string().uri().optional(),
  }).optional(),

  education: Joi.array()
    .items(
      Joi.object({
        institution: Joi.string().required(),
        degree: Joi.string()
          .valid('high-school', 'bachelor', 'master', 'phd', 'mba', 'other')
          .required(),
        field_of_study: Joi.string().required(),
        start_year: Joi.number().min(1950).max(new Date().getFullYear()).required(),
        end_year: Joi.number()
          .min(1950)
          .max(new Date().getFullYear() + 10)
          .optional(),
        is_graduated: Joi.boolean().default(true),
      })
    )
    .optional(),

  experience: Joi.array()
    .items(
      Joi.object({
        company: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().max(1000).optional(),
        start_date: Joi.date().required(),
        end_date: Joi.date().optional(),
        is_current: Joi.boolean().default(false),
        achievements: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),

  skills: Joi.object({
    technical_skills: Joi.array().items(Joi.string()).optional(),
    domain_expertise: Joi.array().items(Joi.string()).optional(),
    leadership_experience: Joi.boolean().optional(),
    years_of_experience: Joi.number().min(0).optional(),
  }).optional(),

  achievements: Joi.array().items(Joi.string()).optional(),
  publications: Joi.array().items(Joi.string()).optional(),
  patents: Joi.array().items(Joi.string()).optional(),
  awards: Joi.array().items(Joi.string()).optional(),
});

export const createFounderValidator = createFounder;

/**
 * Update founder validation schema
 */
export const updateFounderValidator = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),
  startupId: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('ceo', 'cto', 'coo', 'cfo', 'co-founder', 'founder').optional(),

  profile: Joi.object({
    bio: Joi.string().max(2000).optional(),
    linkedin_url: Joi.string().uri().optional(),
    twitter_url: Joi.string().uri().optional(),
    github_url: Joi.string().uri().optional(),
    profile_picture: Joi.string().uri().optional(),
  }).optional(),

  education: Joi.array()
    .items(
      Joi.object({
        institution: Joi.string().required(),
        degree: Joi.string()
          .valid('high-school', 'bachelor', 'master', 'phd', 'mba', 'other')
          .required(),
        field_of_study: Joi.string().required(),
        start_year: Joi.number().min(1950).max(new Date().getFullYear()).required(),
        end_year: Joi.number()
          .min(1950)
          .max(new Date().getFullYear() + 10)
          .optional(),
        is_graduated: Joi.boolean().default(true),
      })
    )
    .optional(),

  experience: Joi.array()
    .items(
      Joi.object({
        company: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().max(1000).optional(),
        start_date: Joi.date().required(),
        end_date: Joi.date().optional(),
        is_current: Joi.boolean().default(false),
        achievements: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),

  skills: Joi.object({
    technical_skills: Joi.array().items(Joi.string()).optional(),
    domain_expertise: Joi.array().items(Joi.string()).optional(),
    leadership_experience: Joi.boolean().optional(),
    years_of_experience: Joi.number().min(0).optional(),
  }).optional(),

  achievements: Joi.array().items(Joi.string()).optional(),
  publications: Joi.array().items(Joi.string()).optional(),
  patents: Joi.array().items(Joi.string()).optional(),
  awards: Joi.array().items(Joi.string()).optional(),
}).min(1);
