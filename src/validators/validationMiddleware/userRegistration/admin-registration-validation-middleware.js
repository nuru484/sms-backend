// src/validators/validationMiddleware/userRegistration/admin-registration-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import { adminRegistrationValidators } from '../../userRegistration/admin-registration-validators.js';

// Validation for Admin registration route
const validateAdminDetails = [
  ...adminRegistrationValidators,
  handleValidationErrors,
];

export default validateAdminDetails;
