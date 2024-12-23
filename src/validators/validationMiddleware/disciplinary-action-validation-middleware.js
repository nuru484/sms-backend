// src/validators/validationMiddleware/disciplinary-action-validation-middleware.js
import {
  disciplinaryActionRegistrationValidators,
  disciplinaryActionUpdateValidators,
} from '../disciplinary-action-validators.js';

import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

export const validateDisciplinaryActionDetails = [
  ...disciplinaryActionRegistrationValidators,
  handleValidationErrors,
];

export const validateDisciplinaryActionUpdate = [
  ...disciplinaryActionUpdateValidators,
  handleValidationErrors,
];
