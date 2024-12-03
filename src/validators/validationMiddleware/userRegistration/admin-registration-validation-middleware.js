// src/validators/validationMiddleware/userRegistration/admin-registration-validation-middleware.js

// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import { adminRegistrationValidators } from '../../userRegistration/admin-registration-validators.js';

// Validation middleware for Admin registration route
// Combines the individual admin registration validators and the error handler
const validateAdminDetails = [
  ...adminRegistrationValidators, // Spread the individual validation rules for admin registration
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export default validateAdminDetails; // Export the validation middleware to be used in routes
