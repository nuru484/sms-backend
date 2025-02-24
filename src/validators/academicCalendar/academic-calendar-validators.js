import {
  validateInput,
  validateDateInput,
  validateObject,
} from '../general-validators.js';

// Factory function to generate validators for AcademicCalendar model
const academicCalendarValidators = () => ({
  validateYear: validateInput('year'),

  // Validator for startDate (required, valid ISO 8601 date format)
  validateStartDate: validateDateInput('startDate'),

  // Validator for endDate (required, valid ISO 8601 date format and must be later than startDate)
  validateEndDate: validateDateInput('endDate', { required: true }),

  // Validator for metadata (optional, valid JSON)
  validateMetadata: validateObject('metadata'),
});

// Validators for creating an AcademicCalendar
export const createAcademicCalendarValidators = Object.values(
  academicCalendarValidators()
);

// Factory function to generate validators for AcademicCalendar model
const academicCalendarUpdateValidators = () => ({
  // Validator for year (optional, max length 50 characters)
  validateYear: validateInput('year', { required: false }),

  // Validator for startDate (optional, valid ISO 8601 date format)
  validateStartDate: validateDateInput('startDate', { required: false }),

  // Validator for endDate (optional, valid ISO 8601 date format and must be later than startDate)
  validateEndDate: validateDateInput('endDate', { required: false }),

  // Validator for metadata (optional, valid JSON)
  validateMetadata: validateObject('metadata'),
});

// Validators for updating an AcademicCalendar
export const createAcademicCalendarUpdateValidators = Object.values(
  academicCalendarUpdateValidators()
);
