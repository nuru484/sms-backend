// src/validators/studentFormerSchool/health&support-validators.js
import { validateInput, validateObject } from '../general-validators.js';

// Factory function to generate validators for HealthAndSupport model
const createHealthAndSupportValidators = () => ({
  // Validator for healthRecords (optional, must be valid JSON)
  validateHealthRecords: validateObject('healthRecords'),

  // Validator for specialNeeds (optional, max length 500 characters)
  validateSpecialNeeds: validateInput('specialNeeds', {
    required: false,
    maxLength: 500,
  }),
});

// Group validators into an array for middleware usage
export const healthAndSupportValidationMiddleware = Object.values(
  createHealthAndSupportValidators()
);
