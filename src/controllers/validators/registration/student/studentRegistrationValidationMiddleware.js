// src/controllers/validators/registration/student/studentRegistrationValidationMiddleware.js

import handleValidationErrors from '../../../../utils/middleware/validationErrorHandler.js';
import { studentRegistrationValidators } from './studentRegistrationValidators.js';

// Validation for Student registration route
const validateStudentDetails = [
  ...studentRegistrationValidators, // Spread the array to include individual validators
  handleValidationErrors,
];

export default validateStudentDetails;
