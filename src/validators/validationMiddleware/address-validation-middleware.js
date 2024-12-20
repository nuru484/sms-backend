// src/controllers/validators/middleware/addressValidationMiddleware.js
import {
  addressRegistrationValidators,
  addressUpdateValidators,
} from '../address-validators.js';
import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

export const validateAddressDetails = [
  ...addressRegistrationValidators,
  handleValidationErrors,
];

export const validateAddressUpdate = [
  ...addressUpdateValidators,
  handleValidationErrors,
];
