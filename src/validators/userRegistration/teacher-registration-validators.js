// src/validators/userRegistration/teacher-registration-validators.js

// Importing general validation functions from the general-validators.js module
import {
  validateInput, // General input validation function for various fields
  validateEmailInput, // Validation function for validating email format
  validatePassword, // Validation function for validating password
  validateConfirmPassword, // Validation function for confirming password match
  validateDateInput, // Validation function for validating date of birth
} from '../general-validators.js';

// Importing the `role` and `employmentType` enums from Prisma client
import { role, employmentType } from '@prisma/client';

// Factory function to generate a set of validators specific to teacher registration
const createTeacherValidators = () => ({
  // Validator for first name with a max length of 255 characters
  validateFirstName: validateInput('firstName', { maxLength: 255 }),

  // Validator for middle name, not required
  validateMiddleName: validateInput('middleName', {
    required: false,
    maxLength: 255,
  }),

  // Validator for last name with a max length of 255 characters
  validateLastName: validateInput('lastName', { maxLength: 255 }),

  // Validator for username field with a unique constraint, max length 255 characters
  validateUsername: validateInput('username', { maxLength: 255 }),

  // Validator for gender with a max length of 50 characters
  validateGender: validateInput('gender', { maxLength: 50 }),

  // Validator for profile photo input, can be optional
  validateProfilePhoto: validateInput('profilePhoto', {
    required: false,
    maxLength: 255,
  }),

  // Validator for email input, ensuring a valid email format
  validateEmail: validateEmailInput('email'),

  // Validator for phone number with a max length of 15 characters
  validatePhoneNumber: validateInput('phoneNumber', { maxLength: 15 }),

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

  // Validator for digital signature
  validateDigitalSignature: validateInput('digitalSignature', {
    required: true,
  }),

  // Validator for spoken languages input
  validateSpokenLanguages: validateInput('spokenLanguages'),

  // Validator for course ID
  validateCourseId: validateInput('courseId'),

  // Validator for class ID
  validateClassId: validateInput('classId'),

  // Validator for social media handles (optional)
  validateSocialMediaHandles: validateInput('socialMediaHandles', {
    required: false,
  }),

  // Validator for marital status input (optional)
  validateMaritalStatus: validateInput('maritalStatus', { required: false }),

  // Validators for password and its confirmation, ensuring correct format and matching values
  validatePassword,
  validateConfirmPassword,
});

// Generate all the teacher-specific validators using the factory function
const teacherValidators = createTeacherValidators();

// Grouping all individual validators into one array for ease of use in middleware
// This array is later used in the teacher registration route for validation
export const teacherRegistrationValidators = Object.values(teacherValidators);
