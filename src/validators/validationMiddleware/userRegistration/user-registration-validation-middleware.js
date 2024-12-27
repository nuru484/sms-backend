// src/validators/validationMiddleware/userRegistration/user-registration-validation-middleware.js

// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import { userRegistrationValidators } from '../../userRegistration/user-registration-validators.js';

// Validation middleware for user registration route
const validateUserDetails = [
  ...userRegistrationValidators, // Spread the individual validation rules for user registration
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export default validateUserDetails; // Export the validation middleware to be used in routes
