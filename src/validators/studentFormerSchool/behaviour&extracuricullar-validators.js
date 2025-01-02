// src/validators/studentFormerSchool/behaviour&Extracuricullar-validators.js
import { validateArray, validateInput } from '../general-validators.js';

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
  validateExtracurriculars: validateArray('extracurriculars'),

  // Validator for achievements (optional, must be a valid JSON array)
  validateAchievements: validateArray('achievements'),
});

// Group validators into an array for middleware usage
export const behaviorAndExtracurricularValidationMiddleware = Object.values(
  createBehaviorAndExtracurricularValidators()
);
