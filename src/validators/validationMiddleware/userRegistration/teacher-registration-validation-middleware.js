// src/validators/validationMiddleware/userRegistration/teacher-registration-validation-middleware.js

// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  teacherRegistrationValidators,
  TeacherUpdateValidationMiddleware,
} from '../../userRegistration/teacher-registration-validators.js';

export const validateTeacherDetails = [
  ...teacherRegistrationValidators, // Spread the individual validation rules for teacher registration
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export const validateTeacherUpdateDetails = [
  ...TeacherUpdateValidationMiddleware, // Spread the individual validation rules for teacher updates
  handleValidationErrors, // Handle any validation errors that arise during the process
];
