// src/validators/validationMiddleware/academicCalendar/academic-calendar-validation-middleware.js
import handleValidationErrors from '../../../utils/middleware/validation-error-handler.js';
import {
  createAcademicCalendarValidators,
  createAcademicCalendarUpdateValidators,
} from '../../academicCalendar/academic-calendar-validators.js';

export const validateAcademicCalendarDetails = [
  ...createAcademicCalendarValidators,
  handleValidationErrors,
];

export const validateAcademicCalendarUpdateDetails = [
  ...createAcademicCalendarUpdateValidators,
  handleValidationErrors,
];
