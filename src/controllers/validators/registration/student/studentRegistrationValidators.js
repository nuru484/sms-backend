// src/controllers/validators/registration/student/studentRegistrationValidators.js
import {
  validateInput,
  validateDateInput,
} from '../general/generalUserRegistrationValidators.js';
import { admissionStatus } from '@prisma/client';

// Factory function to generate student-specific validators
const createStudentValidators = () => ({
  validateFirstName: validateInput('studentFirstName', { maxLength: 100 }),
  validateMiddleName: validateInput('studentMiddleName', { required: false }),
  validateLastName: validateInput('studentLastName', { maxLength: 100 }),
  validateProfilePhoto: validateInput('studentProfilePhoto'),
  validateGender: validateInput('studentGender', { maxLength: 50 }),
  validateEthnicity: validateInput('ethnicity'),
  validatePreviousSchoolName: validateInput('previousSchoolName', {
    required: false,
  }),
  validatePreviousSchoolLevel: validateInput('previousSchoolLevel', {
    required: false,
  }),
  validateDateOfBirth: validateDateInput('dateOfBirth'),
  validateAdmissionStatus: validateInput('admissionStatus')
    .isIn(Object.values(admissionStatus))
    .withMessage('Invalid admission status.'),
  validateUsername: validateInput('studentUsername'),
});

// Generate student validators
const studentValidators = createStudentValidators();

// Grouped export for middleware integration
export const studentRegistrationValidators = Object.values(studentValidators);
