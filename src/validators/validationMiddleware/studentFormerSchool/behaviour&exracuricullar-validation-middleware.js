// src/validators/validationMiddleware/studentFormerSchool/behaviour&exracuricullar-validation-middleware.js

import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';

import { behaviorAndExtracurricularValidationMiddleware } from '../../studentFormerSchool/behaviour&extracuricullar-validators.js';

const validateBehaviorAndExtracurricularDetails = [
  ...behaviorAndExtracurricularValidationMiddleware,
  handleValidationErrors,
];

export default validateBehaviorAndExtracurricularDetails;
