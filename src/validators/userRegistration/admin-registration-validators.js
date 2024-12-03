// src/validators/userRegistration/admin-registration-validators.js
import {
  validateInput,
  validateEmailInput,
  validatePassword,
  validateConfirmPassword,
} from '../general-validators.js';
import { role } from '@prisma/client';

// Factory function to generate admin-specific validators
const createAdminValidators = () => ({
  validateFirstName: validateInput('firstName', { maxLength: 100 }),
  validateMiddleName: validateInput('middleName', { required: false }),
  validateLastName: validateInput('lastName', { maxLength: 100 }),
  validateProfilePhoto: validateInput('profilePhoto'),
  validateGender: validateInput('gender', { maxLength: 50 }),
  validateRole: validateInput('role')
    .isIn(Object.values(role))
    .withMessage('Invalid role.'),
  validateUsername: validateInput('username'),
  validateEmail: validateEmailInput('email'),
  validatePhoneNumber: validateInput('phoneNumber', { maxLength: 15 }),
  validatePassword,
  validateConfirmPassword,
});

// Generate admin validators
const adminValidators = createAdminValidators();

// Grouped export for middleware integration
export const adminRegistrationValidators = Object.values(adminValidators);
