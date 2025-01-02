// src/validators/validationMiddleware/holiday/holiday-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  createHolidayValidators,
  createHolidayUpdateValidators,
} from '../../holiday/holiday-validators.js';

export const validateHolidayDetails = [
  ...createHolidayValidators,
  handleValidationErrors,
];

export const validateHolidayUpdateDetails = [
  ...createHolidayUpdateValidators,
  handleValidationErrors,
];
