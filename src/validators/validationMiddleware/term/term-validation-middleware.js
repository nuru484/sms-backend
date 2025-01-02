// src/validators/validationMiddleware/term/term-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  createTermValidators,
  createTermUpdateValidators,
} from '../../term/term-validators.js';

export const validateTermDetails = [
  ...createTermValidators,
  handleValidationErrors,
];

export const validateTermUpdateDetails = [
  ...createTermUpdateValidators,
  handleValidationErrors,
];
