// src/utils/validation.util.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CustomError } from './error.util';

// Wrapper function to apply Joi schema validation
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Combine body, query, and params into one object for validation
    const validationTarget = { ...req.body, ...req.query, ...req.params };

    const { error } = schema.validate(validationTarget, {
      abortEarly: false, // Report all errors, not just the first one
      stripUnknown: true, // Remove keys not defined in the schema
    });

    if (error) {
      // Map Joi errors to a single string for cleaner error message
      const details = error.details.map((d) => d.message).join(', ');
      return next(new CustomError(400, `Validation Error: ${details}`));
    }

    // If validation passes, continue to the controller
    next();
  };
};
