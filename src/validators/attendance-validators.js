// src/validators/attendance-validators.js
import { body } from 'express-validator';
import { validateInput } from './general-validators.js';

// Factory function to generate attendance-specific validators
const createAttendanceValidators = () => ({
  validateStatus: validateInput('status', { required: true }), // Status is required (enum validation expected)
  validateAbsenceReason: validateInput('absenceReason', {
    maxLength: 255,
    required: false,
  }), // Optional with max length
  validateLatitude: body('latitude')
    .optional()
    .isFloat()
    .withMessage('Latitude must be a float.'), // Latitude is optional but should be a number

  validateLongitude: body('longitude')
    .optional()
    .isFloat()
    .withMessage('Longitude must be a float.'), // Longitude is optional but should be a number
});

// Grouped export for middleware integration
export const attendanceValidatorsList = Object.values(
  createAttendanceValidators()
);

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

// Grouped export for middleware integration
export const attendanceUpdateValidators = Object.values(
  createAttendanceUpdateValidators()
);
