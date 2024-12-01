// src/controllers/validators/paymentValidation.js
import { body } from 'express-validator';

/**
 * Validates the 'Transaction' fields in the request body.
 * Checks if the values meet the required criteria for each field.
 */
const validateInitializeMomoTransaction = () => {
  return [
    // Validate 'amount'
    body('amount')
      .exists({ checkFalsy: true })
      .withMessage('Transaction amount is required')
      .isFloat({ gt: 0 })
      .withMessage('Transaction amount must be a positive number')
      .escape(),

    // Validate 'currency'
    body('currency')
      .exists({ checkFalsy: true })
      .withMessage('Currency is required')
      .isString()
      .withMessage('Currency must be a string')
      .escape(),

    // Validate 'payerAccountNumber'
    body('payerId')
      .exists({ checkFalsy: true })
      .withMessage('Payer account number is required')
      .isString()
      .withMessage('Payer account number must be a string')
      .isLength({ min: 10, max: 10 })
      .withMessage('Payer account number must be exactly 10 characters long')
      .escape(),

    // Validate 'externalId' (unique and required)
    body('externalId')
      .exists({ checkFalsy: true })
      .withMessage('External ID is required')
      .isString()
      .withMessage('External ID must be a string')
      .escape(),
  ];
};

const validateMtnCallbackRequestBody = () => {
  return [
    // Validate externalId
    body('externalId')
      .isString()
      .withMessage('externalId must be a string')
      .notEmpty()
      .withMessage('externalId is required')
      .escape(),

    // Validate amount
    body('amount')
      .isNumeric()
      .withMessage('amount must be a numeric value')
      .notEmpty()
      .withMessage('amount is required')
      .escape(),

    // Validate currency
    body('currency')
      .isString()
      .withMessage('currency must be a string')
      .isLength({ min: 3, max: 3 })
      .withMessage('currency must be a valid 3-character ISO code')
      .notEmpty()
      .withMessage('currency is required')
      .escape(),

    // Validate payer.partyIdType
    body('payer.partyIdType')
      .isString()
      .withMessage('payer.partyIdType must be a string')
      .isIn(['MSISDN', 'EMAIL', 'ACCOUNT'])
      .withMessage('payer.partyIdType must be one of MSISDN, EMAIL, ACCOUNT')
      .escape(),

    // Validate payer.partyId
    body('payer.partyId')
      .isString()
      .withMessage('payer.partyId must be a string')
      .notEmpty()
      .withMessage('payer.partyId is required')
      .isLength({ min: 10, max: 10 })
      .withMessage('Payer account number must be exactly 10 characters long')
      .escape(),

    // Validate payeeNote
    body('payeeNote')
      .isString()
      .withMessage('payeeNote must be a string')
      .notEmpty()
      .withMessage('payeeNote is required')
      .escape(),

    // Validate status
    body('status')
      .isString()
      .withMessage('status must be a string')
      .isIn(['FAILED', 'SUCCESSFUL', 'PENDING'])
      .withMessage('status must be one of FAILED, SUCCESSFUL, PENDING')
      .escape(),

    body('reason')
      .optional()
      .isString()
      .withMessage('reason must be a string')
      .escape(),

    body('financialTransactionId')
      .optional()
      .isString()
      .withMessage('reason must be a string')
      .escape(),
  ];
};

export { validateInitializeMomoTransaction, validateMtnCallbackRequestBody };
