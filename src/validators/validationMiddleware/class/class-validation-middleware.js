// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  classCreationValidators,
  classUpdateValidators,
} from '../../class/class-validators.js';

// Validation middleware for Class creation route
// Combines the individual class creation validators and the error handler
const validateClassDetails = [
  ...classCreationValidators, // Spread the individual validation rules for class creation
  handleValidationErrors, // Handle any validation errors that arise during the process
];

// Validation middleware for Class update route
const validateClassUpdateDetails = [
  ...classUpdateValidators, // Spread the individual validation rules for class update
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export { validateClassDetails, validateClassUpdateDetails }; // Export the validation middleware to be used in routes
