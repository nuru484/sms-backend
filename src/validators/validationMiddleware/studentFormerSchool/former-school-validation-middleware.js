// src/validators/validationMiddleware/studentFormerSchool/former-school-validation-middleware.js

import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';

import { formerSchoolValidationMiddleware } from '../../studentFormerSchool/former-school-validators.js';

export const validateFormerSchoolDetails = [
  ...formerSchoolValidationMiddleware,
  handleValidationErrors,
];
