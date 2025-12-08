// src/lib/constants/validation-rules.ts

export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address.',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: 'Password must be at least 6 characters long.',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    MESSAGE: 'Name must be between 2 and 100 characters.',
  },
  REQUIRED: {
    MESSAGE: 'This field is required.',
  },
  URL: {
    PATTERN: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    MESSAGE: 'Please enter a valid URL.',
  },
  NUMBER: {
    POSITIVE: 'Please enter a positive number.',
    MIN: (min: number) => `Please enter a number greater than or equal to ${min}.`,
    MAX: (max: number) => `Please enter a number less than or equal to ${max}.`,
  },
};
