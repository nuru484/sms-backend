// src/validators/validationMiddleware/admissions/admit-student-validation-middleware.js

// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import { updateAdmissionStatusValidationMiddleware } from '../../admissions/update-admission-status-validators.js';

// Combines the individual validators and the error handler
const validateUpdateAdmissionStatusDetails = [
  ...updateAdmissionStatusValidationMiddleware, // Spread the individual validation rules for admision status
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export default validateUpdateAdmissionStatusDetails; // Export the validation middleware to be used in routes
