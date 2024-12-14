// src/validators/validationMiddleware/studentFormerSchool/academic-perfomance-validation-middleware.js

import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';

import { academicPerformanceValidationMiddleware } from '../../studentFormerSchool/academic-perfomance-validators.js';

const validateAcademicPerformanceDetails = [
  ...academicPerformanceValidationMiddleware,
  handleValidationErrors,
];

export { validateAcademicPerformanceDetails };
