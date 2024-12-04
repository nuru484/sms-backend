// Importing required libraries and utilities
import { v4 as uuidv4 } from 'uuid'; // For generating unique identifiers
import ENV from '../../config/env.js'; // Environment configuration
import logger from '../../utils/logger.js';
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Standardized error handling

/**
 * Initiates a payment request to the MoMo API.
 *
 * @param {string} accessToken - The access token for authentication.
 * @param {number} amount - The payment amount.
 * @param {string} currency - The currency for the payment (e.g., "USD").
 * @param {string} externalId - A unique identifier for the transaction.
 * @param {string} partyId - The payer's identifier (e.g., mobile number).
 * @param {string} partyIdType Payer's identifier type (MSISDN type represents mobile numbers)
 * @param {string} payerMessage - A message from the payer to the payee.
 * @param {string} payeeNote - A note for the payee regarding the transaction.
 * @returns {Promise<Object>} - Returns details about the payment request, including its status and reference ID.
 * @throws {CustomError} - If the payment request fails.
 */
const requestToPay = async (
  accessToken,
  amount,
  currency,
  externalId,
  partyId,
  partyIdType,
  payerMessage,
  payeeNote
) => {
  const referenceId = uuidv4(); // Generate a unique reference ID for the transaction
  const headers = {
    Authorization: `Bearer ${accessToken}`, // Include access token for authorization
    // 'X-Callback-Url': 'http://hkdk.events/xanuc5qainshjl', // Optional callback URL for notifications
    'X-Reference-Id': referenceId, // Reference ID for the payment
    'X-Target-Environment': ENV.MTN_MOMO_TARGET_ENVIRONMENT, // Target environment (sandbox or production)
    'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key, // Subscription key for MoMo API access
    'Content-Type': 'application/json', // Content type for the request body
  };

  const body = JSON.stringify({
    amount, // Amount to be paid
    currency, // Currency of the payment
    externalId, // External identifier for the transaction
    payer: { partyIdType, partyId }, // Payer details (MSISDN type represents mobile numbers)
    payerMessage, // Optional message from the payer
    payeeNote, // Optional note for the payee
  });

  try {
    const response = await fetch(ENV.MTN_MOMO_REQUEST_TO_PAY_URL, {
      method: 'POST', // HTTP method for payment initiation
      headers: headers,
      body: body, // JSON payload for the payment request
    });

    // Handle successful payment request
    if (response.status === 202) {
      logger.info('Request to Pay accepted and pending approval.');
      return {
        response: 'Successful',
        message: 'Request to Pay accepted and pending approval.',
        status: 'PENDING',
        referenceId, // Unique reference ID for tracking the transaction
      };
    } else {
      // Log and throw error for non-successful response
      const errorData = await response.json();
      logger.error({ 'Error in Request to Pay': errorData });
      throw new CustomError(response.status, errorData.message);
    }
  } catch (error) {
    // Log and rethrow any unexpected errors
    logger.error('Request failed:', error);
    throw new CustomError(
      error.status,
      `Failed to initialise payment ${error.message}`
    );
  }
};

/**
 * Checks the status of a payment request using the reference ID.
 *
 * @param {string} accessToken - The access token for authentication.
 * @param {string} referenceId - The unique reference ID for the payment request.
 * @returns {Promise<Object>} - Returns the current status of the payment request.
 * @throws {CustomError} - If the status check fails.
 */
const checkRequestToPayStatus = async (accessToken, referenceId) => {
  const url = `${ENV.REQUEST_TO_PAY_STATUS_URL}/${referenceId}`; // Construct the status check URL

  const headers = {
    Authorization: `Bearer ${accessToken}`, // Include access token for authentication
    'X-Target-Environment': ENV.MTN_MOMO_TARGET_ENVIRONMENT, // Target environment
    'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key, // Subscription key for MoMo API
  };

  try {
    const response = await fetch(url, { method: 'GET', headers: headers }); // Send GET request to check payment status

    // Handle successful response
    if (response.status === 200) {
      const statusData = await response.json();
      logger.info('Transaction Status Data:', statusData);
      return statusData; // Return status data for further processing
    } else {
      // Log and throw error for non-successful response
      const errorData = await response.json();
      logger.error('Error checking status:', errorData);
      throw new CustomError(response.status, errorData.message);
    }
  } catch (error) {
    // Log and rethrow any unexpected errors
    logger.error('Request failed:', error);
    throw new CustomError(error.status, 'Failed to check payment status');
  }
};

// Exporting the functions for external use in the application
export { requestToPay, checkRequestToPayStatus };
