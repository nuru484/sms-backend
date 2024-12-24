// src/validators/studentFormerSchool/behaviour&Extracuricullar-validators.js

import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';

// Factory function to generate validators for BehaviorAndExtracurricular model
const createBehaviorAndExtracurricularValidators = () => ({
  // Validator for behaviorRecord (optional, max length 500 characters)
  validateBehaviorRecord: validateInput('behaviorRecord', {
    required: false,
    maxLength: 500,
  }),

  // Validator for disciplinaryActions (optional, max length 500 characters)
  validateDisciplinaryActions: validateInput('disciplinaryActions', {
    required: false,
    maxLength: 500,
  }),

  // Validator for extracurriculars (optional, must be a valid JSON array)
  validateExtracurriculars: body('extracurriculars')
    .optional()
    .isArray()
    .withMessage('Extracurriculars must be a valid Array.'),

  // Validator for achievements (optional, must be a valid JSON array)
  validateAchievements: body('achievements')
    .optional()
    .isArray()
    .withMessage('Extracurriculars must be a valid Array.'),
});

// Generate validators using the factory function
const behaviorAndExtracurricularValidators =
  createBehaviorAndExtracurricularValidators();

// Group validators into an array for middleware usage
export const behaviorAndExtracurricularValidationMiddleware = Object.values(
  behaviorAndExtracurricularValidators
);
