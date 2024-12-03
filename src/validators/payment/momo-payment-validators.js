import { validateInput } from '../general-validators.js';

const createInitializeMomoTransactionValidators = () => ({
  validateFirstName: validateInput('currency'),
  validateMiddleName: validateInput('payerId', {
    maxLength: 10,
  }).isLength({ min: 10 }),
  validateLastName: validateInput('externalId'),
  validateBody: validateInput('amount')
    .isFloat({ gt: 0 })
    .withMessage('Transaction amount must be a positive number')
    .escape(),
});

const momoTransactionValidators = createInitializeMomoTransactionValidators();

// Export as an array of validators for express-validator middleware use
export const InitializeMomoTransactionValidators = Object.values(
  momoTransactionValidators
);

// Create MTN Callback Validators
const createMtnCallbackValidators = () => ({
  validateExternalId: validateInput('externalId', { required: true }),
  validateAmount: validateInput('amount', { required: true })
    .isNumeric()
    .withMessage('amount must be a numeric value')
    .escape(),
  validateCurrency: validateInput('currency', {
    maxLength: 3,
  }).isLength({ min: 3 }),
  validatePayerPartyIdType: validateInput('payer.partyIdType', {
    required: true,
  })
    .isIn(['MSISDN', 'EMAIL', 'ACCOUNT'])
    .withMessage('payer.partyIdType must be one of MSISDN, EMAIL, ACCOUNT')
    .escape(),
  validatePayerPartyId: validateInput('payer.partyId', {
    maxLength: 10,
    required: true,
  }).isLength({ min: 10 }),
  validatePayeeNote: validateInput('payeeNote', { required: true }),
  validateStatus: validateInput('status', { required: true })
    .isIn(['FAILED', 'SUCCESSFUL', 'PENDING'])
    .withMessage('status must be one of FAILED, SUCCESSFUL, PENDING')
    .escape(),
  validateReason: validateInput('reason', { required: false }),
  validateFinancialTransactionId: validateInput('financialTransactionId', {
    required: false,
  }),
});

// Initialize Validators
const mtnCallbackValidators = createMtnCallbackValidators();

// Export Validators as an Array for Middleware Use
export const validateMtnCallbackRequestBody = Object.values(
  mtnCallbackValidators
);
