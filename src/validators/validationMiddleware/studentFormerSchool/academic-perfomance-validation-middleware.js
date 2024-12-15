// src/validators/validationMiddleware/studentFormerSchool/academic-perfomance-validation-middleware.js

import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';

import {
  academicPerformanceValidationMiddleware,
  academicPerformanceUpdateValidationMiddleware,
} from '../../studentFormerSchool/academic-perfomance-validators.js';

export const validateAcademicPerformanceDetails = [
  ...academicPerformanceValidationMiddleware,
  handleValidationErrors,
];

export const validateAcademicPerformanceUpdateDetails = [
  ...academicPerformanceUpdateValidationMiddleware,
  handleValidationErrors,
];
