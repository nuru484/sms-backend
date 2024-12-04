// src/validators/validationMiddleware/userRegistration/teacher-registration-validation-middleware.js

// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import { teacherRegistrationValidators } from '../../userRegistration/teacher-registration-validators.js';

// Validation middleware for Teacher registration route
// Combines the individual teacher registration validators and the error handler
const validateTeacherDetails = [
  ...teacherRegistrationValidators, // Spread the individual validation rules for teacher registration
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export default validateTeacherDetails; // Export the validation middleware to be used in routes
