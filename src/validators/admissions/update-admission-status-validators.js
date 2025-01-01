// src/validators/admissions/update-admission-status-validators.js
import { validateInput } from '../general-validators.js';
import { admissionStatus } from '@prisma/client';

// Factory function to generate validators
const createUpdateAdmissionStatusValidators = () => ({
  // Validator for admission status
  validateAdmissionStatus: validateInput('admissionStatus')
    .isIn(Object.values(admissionStatus))
    .withMessage('Invalid admission status.'),
});

// Grouping all individual validators into one array for ease of use in middleware
export const updateAdmissionStatusValidationMiddleware = Object.values(
  createUpdateAdmissionStatusValidators()
);
