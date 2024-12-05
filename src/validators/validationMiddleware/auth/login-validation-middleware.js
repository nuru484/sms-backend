// src/validators/validationMiddleware/auth/login-validation-middleware.js

// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import { loginValidationValidators } from '../../auth/login-validators.js';

// Validation middleware for Login route
// Combines the individual login validators and the error handler
const validateLoginDetails = [
  ...loginValidationValidators, // Spread the individual validation rules for login
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export default validateLoginDetails; // Export the validation middleware to be used in routes
