// src/validators/validationMiddleware/parents-registration-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  studentFatherRegistrationValidators,
  studentMotherRegistrationValidators,
  studentParentUpdateValidators,
} from '../../userRegistration/parents-registration-validators.js';

export const validateStudentParentsDetails = [
  ...studentFatherRegistrationValidators,
  ...studentMotherRegistrationValidators,
  handleValidationErrors,
];

export const validateStudentParentUpdateDetails = [
  ...studentParentUpdateValidators,
  handleValidationErrors,
];
