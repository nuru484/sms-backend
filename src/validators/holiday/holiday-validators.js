// src/validators/holiday/holiday-validators.js
import {
  validateInput,
  validateDateInput,
  validateObject,
  validateInteger,
} from '../general-validators.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { fetchAcademicCalendarById } from '../../repositories/academicCalendar/academic-calendar-repository.js';

// Factory function to generate validators for Holiday model
const holidayValidators = () => ({
  // Validator for name (required, max length 100 characters)
  validateName: validateInput('name'),

  // Validator for date (required, valid ISO 8601 date format)
  validateDate: validateDateInput('date'),

  // Validator for description (optional, max length 500 characters)
  validateDescription: validateInput('description', {
    required: false,
    maxLength: 500,
  }),

  // Validator for metadata (optional, valid JSON)
  validateMetadata: validateObject('metadata'),

  // Validator for academicCalendarId (required, must be a valid integer)
  validateAcademicCalendarId: validateInteger('academicCalendarId')
    .custom(async (value) => {
      // Check if the academic calendar exists
      const academicCalendar = await fetchAcademicCalendarById(value);

      if (!academicCalendar) {
        throw new CustomError(
          404,
          `Academic calendar with ID ${value} not found.`
        );
      }

      return true;
    })
    .bail(),
});

// Validators for creating a Holiday
export const createHolidayValidators = Object.values(holidayValidators());

// Factory function to generate validators for updating a Holiday model
const holidayUpdateValidators = () => ({
  // Validator for name (optional, max length 100 characters)
  validateName: validateInput('name', { required: false, maxLength: 100 }),

  // Validator for date (optional, valid ISO 8601 date format)
  validateDate: validateDateInput('date', { required: false }),

  // Validator for description (optional, max length 500 characters)
  validateDescription: validateInput('description', {
    required: false,
    maxLength: 500,
  }),

  // Validator for metadata (optional, valid JSON)
  validateMetadata: validateObject('metadata'),

  // Validator for academicCalendarId (optional, must be a valid integer if provided)
  validateAcademicCalendarId: validateInteger('academicCalendarId')
    .custom(async (value) => {
      // Check if the academic calendar exists
      const academicCalendar = await fetchAcademicCalendarById(value);

      if (value && !academicCalendar) {
        throw new CustomError(
          404,
          `Academic calendar with ID ${value} not found.`
        );
      }

      return true;
    })
    .bail(),
});

// Validators for updating a Holiday
export const createHolidayUpdateValidators = Object.values(
  holidayUpdateValidators()
);
