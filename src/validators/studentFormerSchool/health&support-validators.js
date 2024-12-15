// src/validators/studentFormerSchool/health&support-validators.js

import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';

// Factory function to generate validators for HealthAndSupport model
const createHealthAndSupportValidators = () => ({
  // Validator for healthRecords (optional, must be valid JSON)
  validateHealthRecords: body('healthRecords')
    .optional()
    .custom((value) => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error('Health Records must be a valid JSON array.');
      }
      return true;
    }),

  // Validator for specialNeeds (optional, max length 500 characters)
  validateSpecialNeeds: validateInput('specialNeeds', {
    required: false,
    maxLength: 500,
  }),
});

// Generate validators using the factory function
const healthAndSupportValidators = createHealthAndSupportValidators();

// Group validators into an array for middleware usage
export const healthAndSupportValidationMiddleware = Object.values(
  healthAndSupportValidators
);
