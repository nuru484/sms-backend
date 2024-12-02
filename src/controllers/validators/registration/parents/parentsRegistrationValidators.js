// src/controllers/validators/registration/parents/parentsRegistrationValidators.js
import {
  validateInput,
  validateEmailInput,
} from '../general/generalUserRegistrationValidators.js';

// Factory function to create parent-specific validators
const createParentValidators = (prefix) => ({
  validateFirstName: validateInput(`${prefix}FirstName`),
  validateMiddleName: validateInput(`${prefix}MiddleName`, { required: false }),
  validateLastName: validateInput(`${prefix}LastName`),
  validateProfilePhoto: validateInput(`${prefix}ProfilePhoto`),
  validatePhoneNumber: validateInput(`${prefix}PhoneNumber`, { maxLength: 15 }),
  validateGender: validateInput(`${prefix}Gender`, { maxLength: 50 }),
  validateUsername: validateInput(`${prefix}Username`, { maxLength: 50 }),
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
const studentFatherRegistrationValidators = Object.values(fatherValidators);
const studentMotherRegistrationValidators = Object.values(motherValidators);

export {
  studentFatherRegistrationValidators,
  studentMotherRegistrationValidators,
};
