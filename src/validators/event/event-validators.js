// src/validators/event/event-validators.js
import { body } from 'express-validator';
import { validateInput, validateDateInput } from '../general-validators.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { fetchAcademicCalendarById } from '../../repositories/academicCalendar/academic-calendar-repository.js';

// Factory function to generate validators for Event model
const eventValidators = () => ({
  // Validator for name (required, max length 100 characters)
  validateName: validateInput('name'),

  // Validator for date (required, valid ISO 8601 date format)
  validateDate: validateDateInput('date'),

  // Validator for description (optional, max length 500 characters)
  validateDescription: validateInput('description'),

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

// Validators for creating an Event
export const createEventValidators = Object.values(eventValidators());

// Factory function to generate validators for updating an Event model
const eventUpdateValidators = () => ({
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

// Validators for updating an Event
export const updateEventValidators = Object.values(eventUpdateValidators());
