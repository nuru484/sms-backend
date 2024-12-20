// src/validators/validationMiddleware/student-registration-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  studentRegistrationValidators,
  studentUpdateValidators,
} from '../../userRegistration/student-registration-validators.js';

// Validation for Student registration route
export const validateStudentDetails = [
  ...studentRegistrationValidators, // Spread the array to include individual validators
  handleValidationErrors,
];

export const validateStudentUpdateDetails = [
  ...studentUpdateValidators, // Spread the array to include individual validators
  handleValidationErrors,
];
