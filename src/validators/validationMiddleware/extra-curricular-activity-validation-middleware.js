// src/validators/validationMiddleware/extra-curricular-activities-validation-middleware.js

import {
  extracurricularActivityRegistrationValidators,
  extracurricularActivityUpdateValidators,
} from '../extra-curricular-activity-validators.js';

import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

// Middleware for validating extracurricular activity registration
export const validateExtracurricularActivityDetails = [
  ...extracurricularActivityRegistrationValidators,
  handleValidationErrors,
];

// Middleware for validating extracurricular activity updates
export const validateExtracurricularActivityUpdate = [
  ...extracurricularActivityUpdateValidators,
  handleValidationErrors,
];
