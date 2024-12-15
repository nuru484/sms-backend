// src/validators/validationMiddleware/studentFormerSchool/health&support-validation-middleware.js

import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';

import { healthAndSupportValidationMiddleware } from '../../studentFormerSchool/health&support-validators.js';

export const validateHealthAndSupportDetails = [
  ...healthAndSupportValidationMiddleware,
  handleValidationErrors,
];
