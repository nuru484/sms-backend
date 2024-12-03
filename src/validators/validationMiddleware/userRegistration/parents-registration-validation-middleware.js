// src/validators/validationMiddleware/parents-registration-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  studentFatherRegistrationValidators,
  studentMotherRegistrationValidators,
} from '../../userRegistration/parents-registration-validators.js';

const validateStudentParentsDetails = [
  ...studentFatherRegistrationValidators,
  ...studentMotherRegistrationValidators,
  handleValidationErrors,
];

export default validateStudentParentsDetails;
