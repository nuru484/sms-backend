// src/validators/auth/login-validators.js
import { validateInput, validatePassword } from '../general-validators.js';

// Factory function to generate a set of validators specific to user login
const createLoginValidators = () => ({
  // Validator for username field with a max length of 255 characters
  validateUsername: validateInput('username'),

  // Validator for password field
  validatePassword,
});

export const loginValidationValidators = Object.values(createLoginValidators());
