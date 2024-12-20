// src/validators/userRegistration/parents-registration-validators.js
import {
  validateInput,
  validateEmailInput,
  validateUsernameInput,
} from '../general-validators.js';

// Factory function to create parent-specific validators
const createParentValidators = (prefix) => ({
  validateFirstName: validateInput(`${prefix}FirstName`),
  validateMiddleName: validateInput(`${prefix}MiddleName`, { required: false }),
  validateLastName: validateInput(`${prefix}LastName`),
  validatePhoneNumber: validateInput(`${prefix}PhoneNumber`, { maxLength: 15 }),
  validateRole: validateInput(`${prefix}Role`)
    .isIn(['PARENT'])
    .withMessage(`Invalid ${prefix} role.`),

  validateGender: validateInput(`${prefix}Gender`, { maxLength: 50 }),
  validateUsername: validateUsernameInput(`${prefix}Username`, {
    maxLength: 50,
  }),
  validateRelationshipToStudent: validateInput(
    `${prefix}RelationshipToStudent`,
    { maxLength: 50 }
  ),
  validateEmail: validateEmailInput(`${prefix}Email`, { required: false }),
});

// Create validators for father and mother
const fatherValidators = createParentValidators('studentFather');
const motherValidators = createParentValidators('studentMother');

// Export grouped validators for route handlers
export const studentFatherRegistrationValidators =
  Object.values(fatherValidators);
export const studentMotherRegistrationValidators =
  Object.values(motherValidators);

// Factory function to create parent-specific validators for updates
const createParentUpdateValidators = () => ({
  validateFirstName: validateInput('firstName', { required: false }),
  validateMiddleName: validateInput('middleName', { required: false }),
  validateLastName: validateInput('lastName', { required: false }),
  validatePhoneNumber: validateInput('phoneNumber', {
    required: false,
    maxLength: 15,
  }),
  validateRole: validateInput('role', { required: false })
    .isIn(['PARENT'])
    .withMessage('Invalid role.'),
  validateGender: validateInput('gender', {
    required: false,
    maxLength: 50,
  }),
  validateUsername: validateInput('username', {
    required: false,
    maxLength: 50,
  }),
  validateRelationshipToStudent: validateInput('relationshipToStudent', {
    required: false,
    maxLength: 50,
  }),
  validateEmail: validateInput('email', { required: false })
    .isEmail()
    .withMessage('Invalid email address.'),
  validateWardsIds: validateInput(`wardsIds`, { required: false })
    .isArray()
    .withMessage('Invalid wardsIds, they should be an array of student IDs.'),
});

// Create update validators for father and mother
const parentUpdateValidators = createParentUpdateValidators('studentFather');

// Export grouped validators for route handlers
export const studentParentUpdateValidators = Object.values(
  parentUpdateValidators
);
