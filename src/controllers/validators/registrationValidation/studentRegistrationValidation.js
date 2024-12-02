import handleValidationErrors from '../../../utils/middleware/validationErrorHandler';

import {
  validateEmail,
  validateFirstName,
  validateMiddleName,
  validateLastName,
  validateDateOfBirth,
  validateGender,
  validateProfilePhoto,
  validateEthnicity,
  validatePhoneNumber,
  validatePreviousSchoolName,
  validatePreviousSchoolLevel,
  validateCity,
  validateRegion,
  validateCountry,
  validatePostalCode,
  validateDigitalAddress,
} from './validators';

// Validation for Student registration route
const validateStudentRegistration = [
  validateEmail,
  validateFirstName,
  validateMiddleName,
  validateLastName,
  validateDateOfBirth,
  validateGender,
  validateProfilePhoto,
  validateEthnicity,
  validatePhoneNumber,
  validatePreviousSchoolName,
  validatePreviousSchoolLevel,
  validateCity,
  validateRegion,
  validateCountry,
  validatePostalCode,
  validateDigitalAddress,
  handleValidationErrors,
];

export default validateStudentRegistration;
