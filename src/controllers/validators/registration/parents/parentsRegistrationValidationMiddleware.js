// src/controllers/validators/registration/parents/parentsRegistrationValidationMiddleware.js

import handleValidationErrors from '../../../../utils/middleware/validationErrorHandler.js';
import {
  studentFatherRegistrationValidators,
  studentMotherRegistrationValidators,
} from './parentsRegistrationValidators.js';

const validateStudentParentsDetails = [
  ...studentFatherRegistrationValidators,
  ...studentMotherRegistrationValidators,
  handleValidationErrors,
];

export default validateStudentParentsDetails;
