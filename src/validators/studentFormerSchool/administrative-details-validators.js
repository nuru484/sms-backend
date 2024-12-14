// src/validators/studentFormerSchool/administrative-details-validators.js

import { body } from 'express-validator';

// Factory function to generate validators for AdministrativeDetails model
const createAdministrativeDetailsValidators = () => ({
  // Validator for feesCleared (required, must be a boolean value)
  validateFeesCleared: body('feesCleared')
    .isBoolean()
    .withMessage('Fees cleared must be a boolean value')
    .notEmpty()
    .withMessage('Fees cleared status is required'),
});

// Generate validators using the factory function
const administrativeDetailsValidators = createAdministrativeDetailsValidators();

// Group validators into an array for middleware usage
export const administrativeDetailsValidationMiddleware = Object.values(
  administrativeDetailsValidators
);
