// src/validators/auth/login-validators.js

// Importing general validation functions from the general-validators.js module
import { validateInput, validatePassword } from '../general-validators.js';

// Factory function to generate a set of validators specific to user login
const createLoginValidators = () => ({
  // Validator for username field with a max length of 255 characters
  validateUsername: validateInput('username'),

  // Validator for password field
  validatePassword,
});

// Generate all the login-specific validators using the factory function
const loginValidators = createLoginValidators();

// Grouping all individual validators into one array for ease of use in middleware
// This array is later used in the login route for validation
export const loginValidationValidators = Object.values(loginValidators);
