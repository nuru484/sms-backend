// src/validators/userRegistration/parents-registration-validators.js
import { validateInput, validateEmailInput } from '../general-validators.js';

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
export const studentFatherRegistrationValidators =
  Object.values(fatherValidators);
export const studentMotherRegistrationValidators =
  Object.values(motherValidators);
