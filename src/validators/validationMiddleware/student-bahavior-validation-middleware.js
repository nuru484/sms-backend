// src/validators/validationMiddleware/student-behavior-validation-middleware.js
import {
  studentBehaviorRegistrationValidators,
  studentBehaviorUpdateValidators,
} from '../student-behavior-validators.js';

import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

export const validateStudentBehaviorDetails = [
  ...studentBehaviorRegistrationValidators,
  handleValidationErrors,
];

export const validateStudentBehaviorUpdate = [
  ...studentBehaviorUpdateValidators,
  handleValidationErrors,
];
