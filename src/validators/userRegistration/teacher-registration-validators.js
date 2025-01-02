// src/validators/userRegistration/teacher-registration-validators.js
import {
  validateInput, // General input validation function for various fields
  validateEmailInput, // Validation function for validating email format
  validatePassword, // Validation function for validating password
  validateConfirmPassword, // Validation function for confirming password match
  validateDateInput, // Validation function for validating date of birth
  validateUsernameInput,
  validateArray,
  validateObject,
} from '../general-validators.js';

// Importing the `role` and `employmentType` enums from Prisma client
import { employmentType, role } from '@prisma/client';

// Factory function to generate a set of validators specific to teacher registration
const createTeacherValidators = () => ({
  // Validator for first name with a max length of 255 characters
  validateFirstName: validateInput('firstName', {
    maxLength: 255,
    required: true,
  }),

  // Validator for middle name, not required
  validateMiddleName: validateInput('middleName', {
    required: false,
    maxLength: 255,
  }),

  // Validator for last name with a max length of 255 characters
  validateLastName: validateInput('lastName', {
    maxLength: 255,
    required: true,
  }),

  // Validator for username field with a unique constraint, max length 255 characters
  validateUsername: validateUsernameInput('username'),

  // Validator for gender with a max length of 50 characters
  validateGender: validateInput('gender', { maxLength: 50, required: true }),

  // Validator for email input, ensuring a valid email format
  validateEmail: validateEmailInput('email'),

  // Validator for phone number with a max length of 15 characters
  validatePhoneNumber: validateInput('phoneNumber', {
    maxLength: 15,
    required: true,
  }),

  // Validator for date of birth using the custom validateDateInput function
  validateDateOfBirth: validateDateInput('dateOfBirth'),

  // Validator for role input, ensuring the value is part of the valid `role` enum values
  validateRole: validateInput('role')
    .isIn(Object.values(role)) // Role must be one of the predefined valid roles
    .withMessage('Invalid role.'), // Custom error message for invalid role

  // Validator for employmentType input, ensuring the value is part of the valid `employmentType` enum values
  validateEmploymentType: validateInput('employmentType')
    .isIn(Object.values(employmentType)) // Employment type must be one of the predefined valid types
    .withMessage('Invalid employment type.'),

  // Validator for spoken languages input
  validateSpokenLanguages: validateArray('spokenLanguages', {
    required: true,
    minLength: 1,
  })
    .custom((arr) => arr.every((lang) => typeof lang === 'string'))
    .withMessage('All spoken languages must be strings'),

  // Validator for course ID
  validateCoursesIds: validateArray('coursesIds'),

  // Validator for class ID
  validateClassesIds: validateArray('classesIds'),

  validateSocialMediaHandles: validateObject('socialMediaHandles'),

  // Validator for marital status input (optional)
  validateMaritalStatus: validateInput('maritalStatus', { required: false }),

  // Validators for password and its confirmation, ensuring correct format and matching values
  validatePassword,
  validateConfirmPassword,
});

export const teacherRegistrationValidators = Object.values(
  createTeacherValidators()
);

const createTeacherUpdateValidators = () => ({
  // Validator for first name with a max length of 100 characters (optional for updates)
  validateFirstName: validateInput('firstName', {
    maxLength: 100,
    required: false,
  }),

  // Validator for middle name, not required
  validateMiddleName: validateInput('middleName', { required: false }),

  // Validator for last name with a max length of 100 characters (optional for updates)
  validateLastName: validateInput('lastName', {
    maxLength: 100,
    required: false,
  }),

  // Validator for gender with a max length of 50 characters (optional for updates)
  validateGender: validateInput('gender', { maxLength: 50, required: false }),

  // Validator for role input, ensures the value is part of the valid `role` enum values from Prisma (optional for updates)
  validateRole: validateInput('role', { required: false })
    .optional()
    .isIn(Object.values(role)) // Role must be one of the predefined valid roles
    .withMessage('Invalid role.'), // Custom error message for invalid role

  // Validator for phone number with a max length of 15 characters (optional for updates)
  validatePhoneNumber: validateInput('phoneNumber', {
    maxLength: 15,
    required: false,
  }),

  // Validator for employment type (optional for updates)
  validateEmploymentType: validateInput('employmentType', { required: false })
    .optional()
    .isIn(Object.values(employmentType))
    .withMessage('Invalid employment type.'),

  // Validator for date of birth (optional for updates)
  validateDateOfBirth: validateDateInput('dateOfBirth', { required: false }),

  validateSpokenLanguages: validateArray('spokenLanguages')
    .custom((arr) => arr.every((lang) => typeof lang === 'string'))
    .withMessage('All spoken languages must be strings'),

  // Validator for course ID
  validateCoursesIds: validateArray('coursesIds'),

  // Validator for class ID
  validateClassesIds: validateArray('classesIds'),

  validateSocialMediaHandles: validateObject('socialMediaHandles'),

  // Validator for marital status input (optional)
  validateMaritalStatus: validateInput('maritalStatus', { required: false }),
});

export const TeacherUpdateValidationMiddleware = Object.values(
  createTeacherUpdateValidators()
);
