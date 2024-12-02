// src/controllers/validators/registration/address/addressValidationMiddleware.js
import { addressRegistrationValidators } from './addressValidators.js';
import handleValidationErrors from '../../../../utils/middleware/validationErrorHandler.js';

const validateAddressDetails = [
  ...addressRegistrationValidators,
  handleValidationErrors,
];

export default validateAddressDetails;
