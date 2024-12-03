// src/controllers/validators/middleware/addressValidationMiddleware.js
import { addressRegistrationValidators } from '../address-validators.js';
import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

const validateAddressDetails = [
  ...addressRegistrationValidators,
  handleValidationErrors,
];

export default validateAddressDetails;
