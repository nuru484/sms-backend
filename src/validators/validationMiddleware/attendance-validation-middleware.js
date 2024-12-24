// src/controllers/validators/middleware/attendanceValidationMiddleware.js

import {
  attendanceValidatorsList,
  attendanceUpdateValidators,
} from '../attendance-validators.js';
import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

export const validateAttendanceDetails = [
  ...attendanceValidatorsList,
  handleValidationErrors,
];

export const validateAttendanceUpdate = [
  ...attendanceUpdateValidators,
  handleValidationErrors,
];
