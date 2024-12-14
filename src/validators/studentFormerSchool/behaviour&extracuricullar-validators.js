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
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error('Extracurriculars must be a valid JSON array.');
        }
        return true;
      } catch (error) {
        throw new Error('Extracurriculars must be a valid JSON array.');
      }
    }),

  // Validator for achievements (optional, must be a valid JSON array)
  validateAchievements: body('achievements')
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error('Achievements must be a valid JSON array.');
        }
        return true;
      } catch (error) {
        throw new Error('Achievements must be a valid JSON array.');
      }
    }),
});

// Generate validators using the factory function
const behaviorAndExtracurricularValidators =
  createBehaviorAndExtracurricularValidators();

// Group validators into an array for middleware usage
export const behaviorAndExtracurricularValidationMiddleware = Object.values(
  behaviorAndExtracurricularValidators
);
