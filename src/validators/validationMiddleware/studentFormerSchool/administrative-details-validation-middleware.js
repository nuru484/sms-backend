// src/validators/validationMiddleware/studentFormerSchool/administrative-details-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';

import { administrativeDetailsValidationMiddleware } from '../../studentFormerSchool/administrative-details-validators.js';

const validateAdministrativeDetails = [
  ...administrativeDetailsValidationMiddleware,
  handleValidationErrors,
];

export default validateAdministrativeDetails;
