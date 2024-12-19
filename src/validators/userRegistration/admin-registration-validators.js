// src/validators/userRegistration/admin-registration-validators.js

// Importing general validation functions from the general-validators.js module
import {
  validateInput, // General input validation function for various fields
  validateUsernameInput,
  validateEmailInput, // Validation function for validating email format
  validatePassword, // Validation function for validating password
  validateConfirmPassword, // Validation function for confirming password match
} from '../general-validators.js';

// Importing the `role` enum from Prisma client to ensure role values are validated against predefined values
import { role } from '@prisma/client';

// Factory function to generate a set of validators specific to admin registration
const createAdminValidators = () => ({
  // Validator for first name with a max length of 100 characters
  validateFirstName: validateInput('firstName', { maxLength: 100 }),

  // Validator for middle name, not required
  validateMiddleName: validateInput('middleName', { required: false }),

  // Validator for last name with a max length of 100 characters
  validateLastName: validateInput('lastName', { maxLength: 100 }),

  // Validator for profile photo input, ensuring it is present (or can be optional)
  validateProfilePhoto: validateInput('profilePhoto'),

  // Validator for gender with a max length of 50 characters
  validateGender: validateInput('gender', { maxLength: 50 }),

  // Validator for role input, ensures the value is part of the valid `role` enum values from Prisma
  validateRole: validateInput('role')
    .isIn(Object.values(role)) // Role must be one of the predefined valid roles
    .withMessage('Invalid role.'), // Custom error message for invalid role

  // Validator for username field (basic validation without further constraints)
  validateUsername: validateUsernameInput('username'),

  // Validator for email input, ensuring a valid email format
  validateEmail: validateEmailInput('email'),

  // Validator for phone number with a max length of 15 characters
  validatePhoneNumber: validateInput('phoneNumber', { maxLength: 15 }),

  // Validators for password and its confirmation, ensuring correct format and matching values
  validatePassword,
  validateConfirmPassword,
});

// Generate all the admin-specific validators using the factory function
const adminValidators = createAdminValidators();

// Grouping all individual validators into one array for ease of use in middleware
// This array is later used in the admin registration route for validation
export const adminRegistrationValidators = Object.values(adminValidators);
