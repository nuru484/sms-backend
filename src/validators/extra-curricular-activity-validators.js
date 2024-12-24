import { body } from 'express-validator';
import { validateInput, validateDateInput } from './general-validators.js';

// Factory function to generate ExtracurricularActivity-specific validators
const createExtracurricularActivityValidators = () => ({
  validateActivityName: validateInput('activityName', {
    maxLength: 100,
    required: true,
  }),
  validateStartDate: validateDateInput('startDate', {
    required: true,
  }),
  validateEndDate: validateDateInput('endDate', {
    required: false,
  }),
  validatePosition: validateInput('position', {
    maxLength: 100,
    required: false,
  }),
  validateDescription: validateInput('description', {
    required: false,
  }),
  validateAchievements: body('achievements')
    .optional() // Marking the field as optional
    .isArray()
    .withMessage('Achievements must be a valid array if provided.'),
});

// Generate ExtracurricularActivity validators
const extracurricularActivityValidators =
  createExtracurricularActivityValidators();

// Grouped export for middleware integration
export const extracurricularActivityRegistrationValidators = Object.values(
  extracurricularActivityValidators
);

// Factory function to generate ExtracurricularActivity-specific validators for updates
const createExtracurricularActivityUpdateValidators = () => ({
  validateActivityName: validateInput('activityName', {
    maxLength: 100,
    required: false,
  }),
  validateStartDate: validateDateInput('startDate', {
    required: false,
  }),
  validateEndDate: validateDateInput('endDate', {
    required: false,
  }),
  validatePosition: validateInput('position', {
    maxLength: 100,
    required: false,
  }),
  validateDescription: validateInput('description', {
    required: false,
  }),
  validateAchievements: body('achievements')
    .optional() // Marking the field as optional
    .isArray()
    .withMessage('Achievements must be a valid array if provided.'),
});

// Generate ExtracurricularActivity update validators
const extracurricularActivityUpdateValidatorsFunction =
  createExtracurricularActivityUpdateValidators();

// Grouped export for middleware integration
export const extracurricularActivityUpdateValidators = Object.values(
  extracurricularActivityUpdateValidatorsFunction
);
