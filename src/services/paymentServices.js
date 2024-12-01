// Importing logger utility for logging application events and errors
import logger from '../utils/logger.js';

// Importing CustomError for standardized error handling
import { CustomError } from '../utils/middleware/errorHandler.js';

// Importing the service to send a request to pay via MoMo API
import { requestToPay } from './requestToPay.js';

// Importing repository functions for managing transaction records
import {
  createMomoTransaction, // Creates a record for a new MoMo transaction
  updateMomoTransactionStatus, // Updates the status of an existing MoMo transaction
} from '../repositories/transactionRepository.js';

/**
 * Processes a MoMo payment by initiating a request to pay.
 *
 * @param {string} accessToken - The access token for authenticating the request.
 * @param {number} amount - The payment amount.
 * @param {string} currency - The currency for the transaction (e.g., "USD").
 * @param {string} externalId - A unique identifier for the transaction.
 * @param {string} payerId - The payer's identifier (e.g., mobile number).
 * @param {string} payerMessage - A message from the payer to be included in the transaction.
 * @param {string} payeeNote - A note from the payee for the transaction.
 * @returns {Promise<Object>} - The response from the MoMo API request to pay.
 * @throws {CustomError} - If the payment processing fails.
 */
const processMomoPayment = async (
  accessToken,
  amount,
  currency,
  externalId,
  payerId,
  payerMessage,
  payeeNote
) => {
  // Validate inputs to ensure all required parameters are present
  if (!accessToken || !amount || !currency || !externalId || !payerId) {
    throw new CustomError(
      400,
      'Missing required parameters for processing payment'
    );
  }

  // Log the details of the payment being processed
  logger.info({
    'Processing MoMo payment': {
      payerId,
      amount,
      externalId,
      currency,
      payerMessage,
      payeeNote,
    },
  });

  try {
    // Initiate the request to pay using MoMo API
    const requestToPayResponse = await requestToPay(
      accessToken,
      amount,
      currency,
      externalId,
      payerId,
      payerMessage,
      payeeNote
    );

    // Payment details to be saved in the database
    const paymentDetails = {
      accessToken,
      amount,
      currency,
      externalId,
      payerId,
      payerMessage,
      payeeNote,
      referenceId: requestToPayResponse.referenceId,
      status: requestToPayResponse.status,
    };

    // Save the transaction details in the database
    await createMomoTransaction(paymentDetails);

    // Log a successful payment processing event
    logger.info({
      'MoMo payment processed successfully': {
        payerId,
        externalId,
        response: requestToPayResponse,
      },
    });

    // Return the API response for further processing
    return requestToPayResponse;
  } catch (error) {
    // Log the error details for debugging
    logger.error({
      'Error processing MoMo payment': {
        error: error.message,
        stack: error.stack,
        details: { payerId, amount, externalId, currency },
      },
    });

    // Throw a standardized error
    throw new CustomError(
      500,
      `Failed to process MoMo payment: ${error.message}`
    );
  }
};

/**
 * Updates the status of a MoMo payment based on callback details.
 *
 * @param {Object} paymentDetails - The details of the payment status update.
 * @param {string} paymentDetails.payer - The payer's identifier.
 * @param {string} paymentDetails.status - The status of the payment (e.g., "SUCCESSFUL", "FAILED").
 * @param {string} paymentDetails.financialTransactionId - The transaction ID if successful.
 * @param {string} paymentDetails.reason - The reason for a failed transaction.
 * @param {string} paymentDetails.externalId - The unique identifier for the transaction.
 * @returns {Promise<Object>} - The updated transaction status and details.
 * @throws {CustomError} - If the status update fails.
 */
const processMomoPaymentStatus = async (paymentDetails) => {
  const { payer, status, financialTransactionId, reason, externalId } =
    paymentDetails;

  // Log the details of the status update being processed
  logger.info({ 'Processing payment status': { payer, status } });

  try {
    if (status === 'SUCCESSFUL') {
      // Update the transaction record for successful payments
      const response = await updateMomoTransactionStatus(externalId, {
        status,
        financialTransactionId,
      });

      // Return a success message with updated details
      return {
        message: 'Payment processed successfully.',
        status: response.status,
        financialTransactionId: response.financialTransactionId,
      };
    } else {
      // Update the transaction record for failed or pending payments
      const response = await updateMomoTransactionStatus(externalId, {
        status,
        reason,
      });

      // Return a message indicating incomplete payment with details
      return {
        message: 'Payment recorded, but not completed.',
        status: response.status,
        reason: response.details,
      };
    }
  } catch (error) {
    // Log the error details for debugging
    logger.error({
      'Error processing Transaction status': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a standardized error
    throw new CustomError(
      500,
      `Failed to process Transaction: ${error.message}`
    );
  }
};

// Exporting the payment service functions for external use
export { processMomoPayment, processMomoPaymentStatus };
