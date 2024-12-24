import { body } from 'express-validator';
import { validateInput } from './general-validators.js';

// Factory function to generate attendance-specific validators
const createAttendanceValidators = () => ({
  validateStatus: validateInput('status', { required: true }), // Status is required (enum validation expected)
  validateAbsenceReason: validateInput('absenceReason', {
    maxLength: 255,
    required: false,
  }), // Optional with max length
  validateLatitude: validateInput('latitude')
    .optional()
    .isFloat()
    .withMessage('Latitude must be a float.'), // Latitude is optional but should be a number

  validateLongitude: validateInput('longitude')
    .optional()
    .isFloat()
    .withMessage('Longitude must be a float.'), // Longitude is optional but should be a number
});

// Generate attendance validators
const attendanceValidators = createAttendanceValidators();

// Grouped export for middleware integration
export const attendanceValidatorsList = Object.values(attendanceValidators);

// Factory function to generate attendance-specific validators for updates
const createAttendanceUpdateValidators = () => ({
  validateStatus: validateInput('status', { required: false }), // Not required on update
  validateAbsenceReason: validateInput('absenceReason', {
    maxLength: 255,
    required: false,
  }), // Optional on update
  validateLatitude: body('latitude')
    .optional()
    .isFloat()
    .withMessage('Latitude must be a float.'), // Optional on update

  validateLongitude: body('longitude')
    .optional()
    .isFloat()
    .withMessage('Longitude must be a float.'), // Optional on update
});

// Generate attendance update validators
const attendanceUpdateValidatorsFunction = createAttendanceUpdateValidators();

// Grouped export for middleware integration
export const attendanceUpdateValidators = Object.values(
  attendanceUpdateValidatorsFunction
);
