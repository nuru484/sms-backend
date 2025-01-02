//  src/validators/studentFormerSchool/former-school-validators.js
import {
  validateInput,
  validateDateInput,
  validateEmailInput,
} from '../general-validators.js';

// Factory function to generate validators for FormerSchool model
const createFormerSchoolValidators = () => ({
  // Validator for name (required, max length 255 characters)
  validateName: validateInput('name', {
    maxLength: 255,
    required: true,
  }),
  // Validator for address (optional, max length 500 characters)
  validateAddress: validateInput('address', {
    required: false,
    maxLength: 500,
  }),

  // Validator for contactNumber (optional, max length 15 characters)
  validateContactNumber: validateInput('contactNumber', {
    required: false,
    maxLength: 15,
  }),

  // Validator for email (optional, valid email format and max length 255 characters)
  validateEmail: validateEmailInput('email', {
    required: false,
    maxLength: 255,
  }),

  // Validator for schoolType (optional, max length 100 characters)
  validateSchoolType: validateInput('schoolType', {
    required: false,
    maxLength: 100,
  }),

  // Validator for startDate (optional, valid ISO 8601 date format)
  validateStartDate: validateDateInput('startDate', { required: false }),

  // Validator for endDate (optional, valid ISO 8601 date format and must be later than startDate)
  validateEndDate: validateDateInput('endDate', { required: false }),

  // Validator for reasonForLeaving (optional, max length 500 characters)
  validateReasonForLeaving: validateInput('reasonForLeaving', {
    required: false,
    maxLength: 500,
  }),
});

// Generate validators using the factory function
const formerSchoolValidators = createFormerSchoolValidators();

// Group validators into an array for middleware usage
export const formerSchoolValidationMiddleware = Object.values(
  formerSchoolValidators
);
