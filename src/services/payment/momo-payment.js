// Importing logger utility for logging application events and errors

// Importing the service to send a request to pay via MoMo API
import { requestToPay } from '../momoApi/request-to-pay.js';

// Importing repository functions for managing transaction records
import {
  createMomoTransaction, // Creates a record for a new MoMo transaction
  updateMomoTransactionStatus, // Updates the status of an existing MoMo transaction
} from '../../repositories/payment/momo-payment-repository.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

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
  partyId,
  partyIdType,
  payerMessage,
  payeeNote
) => {
  try {
    // Initiate the request to pay using MoMo API
    const requestToPayResponse = await requestToPay(
      accessToken,
      amount,
      currency,
      externalId,
      partyId,
      partyIdType,
      payerMessage,
      payeeNote
    );

    // Payment details to be saved in the database
    const paymentDetails = {
      accessToken,
      amount,
      currency,
      externalId,
      partyId,
      partyIdType,
      payerMessage,
      payeeNote,
      referenceId: requestToPayResponse.referenceId,
      status: requestToPayResponse.status,
    };

    // Save the transaction details in the database
    await createMomoTransaction(paymentDetails);

    // Return the API response for further processing
    return requestToPayResponse;
  } catch (error) {
    handlePrismaError(error, 'process momo payment');
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
    handlePrismaError(error, 'process momo payment status');
  }
};

// Exporting the payment service functions for external use
export { processMomoPayment, processMomoPaymentStatus };
