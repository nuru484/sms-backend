// src/controllers/paymentController.js

// Import necessary modules and services
import { validationResult } from 'express-validator'; // For validating incoming request data
import { processMomoPaymentStatus } from '../services/paymentServices.js'; // Service to handle payment status processing
import logger from '../utils/logger.js'; // Logger utility for structured logging
import { processMomoPayment } from '../services/paymentServices.js'; // Service to handle MoMo payment initialization
import moMoApiAccessToken from '../services/createMoMoApiAccessToken.js'; // Service to retrieve MoMo API access token

/**
 * Controller function to initialize a MoMo (Mobile Money) transaction.
 * Validates the incoming request, retrieves an API access token,
 * and processes the payment with the provided details.
 *
 * @param {Object} req - Express request object containing the transaction details in the body.
 * @param {Object} res - Express response object used to send responses to the client.
 * @param {Function} next - Express next middleware function for error handling.
 */
const initializeMomoTransaction = async (req, res, next) => {
  try {
    // Validate the request body for any errors defined in validation middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Respond with a 400 status and validation errors if validation fails
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract required payment details from the request body
    const { amount, currency, externalId, payerId, payerMessage, payeeNote } =
      req.body;

    // Log the incoming request details for debugging and traceability
    logger.info({ 'Initializing MoMo Transaction': { requestBody: req.body } });

    // Retrieve the API access token required for authentication with the MoMo payment service
    const accessToken = await moMoApiAccessToken();
    logger.info('Successfully retrieved MoMo API access token.');

    // Process the payment using the MoMo payment service
    const response = await processMomoPayment(
      accessToken,
      amount,
      currency,
      externalId,
      payerId,
      payerMessage,
      payeeNote
    );

    // Log the successful transaction initialization and response
    logger.info('MoMo transaction initialized successfully', { response });

    // Respond to the client with the payment initialization response
    return res.status(200).json({ ...response });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error('Error in initializeMomoTransaction', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
    });

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};

/**
 * Controller function to handle payment callback notifications from the MoMo service.
 * Validates the incoming request, processes the payment status update, and sends an appropriate response.
 *
 * @param {Object} req - Express request object containing the callback data in the body.
 * @param {Object} res - Express response object used to send responses to the client.
 * @param {Function} next - Express next middleware function for error handling.
 */
const paymentCallback = async (req, res, next) => {
  try {
    // Validate the request body for any errors defined in validation middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Respond with a 400 status and validation errors if validation fails
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract payment details from the request body
    const paymentDetails = req.body;

    // Process the payment status using the MoMo payment service
    const response = await processMomoPaymentStatus(paymentDetails);

    // Respond to the client with the processed payment status
    return res.status(200).json(response);
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error('Error in payment callback', { error });

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};

// Export the controller functions to be used in routes
export { initializeMomoTransaction, paymentCallback };
