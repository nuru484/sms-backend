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
      .withMessage('Transaction amount must be a positive number'),

    // Validate 'currency'
    body('currency')
      .exists({ checkFalsy: true })
      .withMessage('Currency is required')
      .isString()
      .withMessage('Currency must be a string'),

    // Validate 'payerAccountNumber'
    body('payerId')
      .exists({ checkFalsy: true })
      .withMessage('Payer account number is required')
      .isString()
      .withMessage('Payer account number must be a string')
      .isLength({ min: 10, max: 10 })
      .withMessage('Payer account number must be exactly 10 characters long'),

    // Validate 'externalId' (unique and required)
    body('externalId')
      .exists({ checkFalsy: true })
      .withMessage('External ID is required')
      .isString()
      .withMessage('External ID must be a string'),
  ];
};

export { validateInitializeMomoTransaction };
