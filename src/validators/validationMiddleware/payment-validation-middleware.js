// src/validators/validationMiddleware/payment-validation-middleware.js

import handleValidationErrors from '../../utils/middleware/validation-error-handler.js';

import {
  InitializeMomoTransactionValidators,
  validateMtnCallbackRequestBody,
} from '../payment/momo-payment-validators.js';

export const validateMomoTransaction = [
  ...InitializeMomoTransactionValidators,
  handleValidationErrors,
];

export const validateMomoPaymentCallback = [
  ...validateMtnCallbackRequestBody,
  handleValidationErrors,
];
