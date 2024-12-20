// src/controllers/validators/registration/student/studentRegistrationValidators.js
import {
  validateInput, // General input validation function for various fields
  validatePassword, // Validation function for validating password
  validateConfirmPassword, // Validation function for confirming password match
  validateDateInput, // Validation function for validating date of birth
  validateUsernameInput,
} from '../general-validators.js';

// Factory function to generate student-specific validators
const createStudentValidators = () => ({
  validateFirstName: validateInput('studentFirstName', {
    maxLength: 100,
    required: true,
  }),
  validateMiddleName: validateInput('studentMiddleName', { required: false }),
  validateLastName: validateInput('studentLastName', {
    maxLength: 100,
    required: true,
  }),
  validateGender: validateInput('studentGender', {
    maxLength: 50,
    required: true,
  }),
  validateEthnicity: validateInput('ethnicity'),
  validateRole: validateInput('studentRole')
    .isIn(['STUDENT'])
    .withMessage('Invalid student role, student role must be STUDENT!'),
  validateDateOfBirth: validateDateInput('dateOfBirth'),
  validateAdmissionStatus: validateInput('admissionStatus')
    .isIn(['PENDING'])
    .withMessage(
      'Invalid admission status, student admission status must be PENDING for now!'
    ),
  validateUsername: validateUsernameInput('studentUsername'),
  validatePassword,
  validateConfirmPassword,
});

// Generate student validators
const studentValidators = createStudentValidators();

// Grouped export for middleware integration
export const studentRegistrationValidators = Object.values(studentValidators);

// Factory function to generate student-specific validators for updates
const createStudentUpdateValidators = () => ({
  validateFirstName: validateInput('studentFirstName', {
    maxLength: 100,
    required: false, // Not required on update
  }),
  validateMiddleName: validateInput('studentMiddleName', { required: false }),
  validateLastName: validateInput('studentLastName', {
    maxLength: 100,
    required: false, // Not required on update
  }),
  validateGender: validateInput('studentGender', {
    maxLength: 50,
    required: false, // Not required on update
  }),
  validateEthnicity: validateInput('ethnicity', { required: false }), // Ethnicity may not be updated
  validateDateOfBirth: validateDateInput('dateOfBirth', { required: false }), // Not required on update
  validateUsername: validateInput('studentUsername', {
    required: false,
  }), // Not required if not changing
  validatePassword: validatePassword.optional(), // Only validate if password is updated
  validateConfirmPassword: validateConfirmPassword.optional(), // Only validate if password is updated
});

// Generate student update validators

const studentUpdateValidatorsFuntion = createStudentUpdateValidators();

// Grouped export for middleware integration
export const studentUpdateValidators = Object.values(
  studentUpdateValidatorsFuntion
);
