// src/validators/term/term-validators.js
import { body } from 'express-validator';
import { validateInput, validateDateInput } from '../general-validators.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { fetchAcademicCalendarById } from '../../repositories/academicCalendar/academic-calendar-repository.js';

// Factory function to generate validators for Term model
const termValidators = () => ({
  // Validator for name (required, max length 100 characters)
  validateName: validateInput('name'),

  // Validator for startDate (required, valid ISO 8601 date format)
  validateStartDate: validateDateInput('startDate'),

  // Validator for endDate (required, valid ISO 8601 date format and must be later than startDate)
  validateEndDate: validateDateInput('endDate'),

  // Validator for metadata (optional, valid JSON)
  validateMetadata: body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
    .bail(),

  // Validator for academicCalendarId (required, must be a valid integer)
  validateAcademicCalendarId: body('academicCalendarId')
    .isInt()
    .withMessage('AcademicCalendar ID must be a valid integer')
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

// Validators for creating a Term
export const createTermValidators = Object.values(termValidators());

// Factory function to generate validators for updating a Term model
const termUpdateValidators = () => ({
  // Validator for name (optional, max length 100 characters)
  validateName: validateInput('name', { required: false, maxLength: 100 }),

  // Validator for startDate (optional, valid ISO 8601 date format)
  validateStartDate: validateDateInput('startDate', { required: false }),

  // Validator for endDate (optional, valid ISO 8601 date format and must be later than startDate)
  validateEndDate: validateDateInput('endDate', { required: false }),

  // Validator for metadata (optional, valid JSON)
  validateMetadata: body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
    .bail(),

  // Validator for academicCalendarId (optional, must be a valid integer if provided)
  validateAcademicCalendarId: body('academicCalendarId')
    .optional()
    .isInt()
    .withMessage('AcademicCalendar ID must be a valid integer')
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

// Validators for updating a Term
export const createTermUpdateValidators = Object.values(termUpdateValidators());
