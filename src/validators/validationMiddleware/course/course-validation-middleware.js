// src/validators/validationMiddleware/course/course-creation-validation-middleware.js

// Import necessary functions for validation and error handling
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  courseCreationValidators,
  courseUpdateValidators,
} from '../../course/course-validators.js';

// Validation middleware for Course creation route
// Combines the individual course creation validators and the error handler
const validateCourseDetails = [
  ...courseCreationValidators, // Spread the individual validation rules for course creation
  handleValidationErrors, // Handle any validation errors that arise during the process
];

// Validation middleware for Course update route
const validateCourseUpdateDetails = [
  ...courseUpdateValidators, // Spread the individual validation rules for course update
  handleValidationErrors, // Handle any validation errors that arise during the process
];

export { validateCourseDetails, validateCourseUpdateDetails }; // Export the validation middleware to be used in routes
