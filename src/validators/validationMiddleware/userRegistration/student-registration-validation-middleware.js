// src/validators/validationMiddleware/student-registration-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import { studentRegistrationValidators } from '../../userRegistration/student-registration-validators.js';

// Validation for Student registration route
const validateStudentDetails = [
  ...studentRegistrationValidators, // Spread the array to include individual validators
  handleValidationErrors,
];

export default validateStudentDetails;
