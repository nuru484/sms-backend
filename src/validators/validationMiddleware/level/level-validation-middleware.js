// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  levelCreationValidators,
  levelUpdateValidators,
} from '../../level/level-validators.js';

// Validation middleware for Level creation route
// Combines the individual level creation validators and the error handler
const validateLevelDetails = [
  ...levelCreationValidators, // Spread the individual validation rules for level creation
  handleValidationErrors, // Handle any validation errors that arise during the process
];

// Validation middleware for Level update route
const validateLevelUpdateDetails = [
  ...levelUpdateValidators, // Spread the individual validation rules for level update
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export { validateLevelDetails, validateLevelUpdateDetails }; // Export the validation middleware to be used in routes
