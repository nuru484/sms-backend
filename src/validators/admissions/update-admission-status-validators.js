// src/validators/admissions/update-admission-status-validators.js

// Importing general validation functions from the general-validators.js module
import { validateInput } from '../general-validators.js';

import { admissionStatus } from '@prisma/client';

// Factory function to generate validators
const createUpdateAdmissionStatusValidators = () => ({
  // Validator for admission status
  validateAdmissionStatus: validateInput('admissionStatus')
    .isIn(Object.values(admissionStatus))
    .withMessage('Invalid admission status.'),
});

// Generate all the validators using the factory function
const updateAdmissionStatusValidators = createUpdateAdmissionStatusValidators();

// Grouping all individual validators into one array for ease of use in middleware
export const updateAdmissionStatusValidationMiddleware = Object.values(
  updateAdmissionStatusValidators
);
