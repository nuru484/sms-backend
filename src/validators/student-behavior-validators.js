import { validateInput, validateDateInput } from './general-validators.js';

// Factory function to generate StudentBehavior-specific validators
const createStudentBehaviorValidators = () => ({
  validateBehaviorDate: validateDateInput('behaviorDate', {
    required: true,
  }),
  validateBehaviorType: validateInput('behaviorType', {
    maxLength: 50,
    required: false, // Optional
  }),
  validateBehavior: validateInput('behavior', {
    maxLength: 255,
    required: true,
  }),
  validateDescription: validateInput('description', {
    required: true,
  }),
});

// Generate StudentBehavior validators
const studentBehaviorValidators = createStudentBehaviorValidators();

// Grouped export for middleware integration
export const studentBehaviorRegistrationValidators = Object.values(
  studentBehaviorValidators
);

// Factory function to generate StudentBehavior-specific validators for updates
const createStudentBehaviorUpdateValidators = () => ({
  validateBehaviorDate: validateDateInput('behaviorDate', {
    required: false,
  }),
  validateBehaviorType: validateInput('behaviorType', {
    maxLength: 50,
    required: false,
  }),
  validateBehavior: validateInput('behavior', {
    maxLength: 255,
    required: false,
  }),
  validateDescription: validateInput('description', {
    required: false,
  }),
});

// Generate StudentBehavior update validators
const studentBehaviorUpdateValidatorsFunction =
  createStudentBehaviorUpdateValidators();

// Grouped export for middleware integration
export const studentBehaviorUpdateValidators = Object.values(
  studentBehaviorUpdateValidatorsFunction
);
