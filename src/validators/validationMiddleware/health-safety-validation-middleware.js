// src/validators/validationMiddleware/health-safety-validation-middleware.js
import {
  healthAndSafetyRegistrationValidators,
  healthAndSafetyUpdateValidators,
} from '../health-safety-validators.js';

import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

export const validateHealthAndSafetyDetails = [
  ...healthAndSafetyRegistrationValidators,
  handleValidationErrors,
];

export const validateHealthAndSafetyUpdate = [
  ...healthAndSafetyUpdateValidators,
  handleValidationErrors,
];
