// src/validators/studentFormerSchool/health&support-validators.js

import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';

// Factory function to generate validators for HealthAndSupport model
const createHealthAndSupportValidators = () => ({
  // Validator for healthRecords (optional, must be valid JSON)
  validateHealthRecords: body('healthRecords')
    .optional()
    .isJSON()
    .withMessage('Health records must be a valid JSON object'),

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
