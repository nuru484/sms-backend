// src/controllers/validators/registration/student/studentRegistrationValidators.js
import prisma from '../../config/prismaClient.js';
import {
  validateInput, // General input validation function for various fields
  validatePassword, // Validation function for validating password
  validateConfirmPassword, // Validation function for confirming password match
  validateDateInput, // Validation function for validating date of birth
  validateUsernameInput,
} from '../general-validators.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';

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

  validateApplicationNumber: validateInput('studentApplicationNumber').custom(
    async (value) => {
      const number = await prisma.studentApplicationNumber.findUnique({
        where: { number: value },
      });

      if (!number) {
        throw new CustomError(400, `Invalid student application number`);
      }

      if (!number.isSold) {
        throw new CustomError(
          404,
          `Student application number ${value} not sold.`
        );
      }

      if (number.isUsed) {
        throw new CustomError(
          409,
          `Student application number ${value} has been used already.`
        );
      }

      // If all checks pass, validation is successful
      return true;
    }
  ),

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
  validateFirstName: validateInput('firstName', {
    maxLength: 100,
    required: false, // Not required on update
  }),
  validateMiddleName: validateInput('middleName', { required: false }),

  validateLastName: validateInput('lastName', {
    maxLength: 100,
    required: false, // Not required on update
  }),
  validateGender: validateInput('gender', {
    maxLength: 50,
    required: false, // Not required on update
  }),

  validateRole: validateInput('role', { required: false })
    .isIn(['STUDENT'])
    .withMessage('Invalid student role, student role must be STUDENT!'),

  validateEthnicity: validateInput('ethnicity', { required: false }), // Ethnicity may not be updated

  validateDateOfBirth: validateDateInput('dateOfBirth', { required: false }), // Not required on update

  validateUsername: validateInput('username', {
    required: false,
  }), // Not required if not changing
});

// Generate student update validators
const studentUpdateValidatorsFuntion = createStudentUpdateValidators();

// Grouped export for middleware integration
export const studentUpdateValidators = Object.values(
  studentUpdateValidatorsFuntion
);
