// src/validators/validationMiddleware/event/event-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  createEventValidators,
  updateEventValidators,
} from '../../event/event-validators.js';

export const validateEventDetails = [
  ...createEventValidators,
  handleValidationErrors,
];

export const validateEventUpdateDetails = [
  ...updateEventValidators,
  handleValidationErrors,
];
