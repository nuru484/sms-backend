// src/validators/validationMiddleware/studentFormerSchool/former-school-validation-middleware.js

import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';

import { formerSchoolValidationMiddleware } from '../../studentFormerSchool/former-school-validators.js';

const validateFormerSchoolDetails = [
  ...formerSchoolValidationMiddleware,
  handleValidationErrors,
];

export default validateFormerSchoolDetails;
