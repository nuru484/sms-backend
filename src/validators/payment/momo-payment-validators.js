// src/validators/payment/momo-payment-validators.js
import { validateInput } from '../general-validators.js';

const createInitializeMomoTransactionValidators = () => ({
  validateCurrency: validateInput('currency'),
  validatePayerPartyId: validateInput('partyId', {
    maxLength: 10,
  }).isLength({ min: 10 }),
  validateExternalId: validateInput('externalId'),
  validatePayerPartyIdType: validateInput('partyIdType'),
  validatePayeeNote: validateInput('payeeNote'),
  validatePayerMessage: validateInput('payerMessage'),
  validateAmount: validateInput('amount')
    .isFloat({ gt: 0 })
    .withMessage('Transaction amount must be a positive number')
    .escape(),
});

// Export as an array of validators for express-validator middleware use
export const InitializeMomoTransactionValidators = Object.values(
  createInitializeMomoTransactionValidators()
);

// Create MTN Callback Validators
const createMtnCallbackValidators = () => ({
  validateExternalId: validateInput('externalId'),
  validateAmount: validateInput('amount')
    .isNumeric()
    .withMessage('amount must be a numeric value')
    .escape(),
  validateCurrency: validateInput('currency', {
    maxLength: 3,
  }).isLength({ min: 3 }),
  validatePayerPartyIdType: validateInput('payer.partyIdType')
    .isIn(['MSISDN', 'EMAIL', 'ACCOUNT'])
    .withMessage('payer.partyIdType must be one of MSISDN, EMAIL, ACCOUNT')
    .escape(),
  validatePayerPartyId: validateInput('payer.partyId', {
    maxLength: 10,
    required: true,
  }).isLength({ min: 10 }),
  validatePayeeNote: validateInput('payeeNote'),
  validateStatus: validateInput('status')
    .isIn(['FAILED', 'SUCCESSFUL', 'PENDING'])
    .withMessage('status must be one of FAILED, SUCCESSFUL, PENDING')
    .escape(),
  validateReason: validateInput('reason', { required: false }),
  validateFinancialTransactionId: validateInput('financialTransactionId', {
    required: false,
  }),
});

// Export Validators as an Array for Middleware Use
export const validateMtnCallbackRequestBody = Object.values(
  createMtnCallbackValidators()
);
