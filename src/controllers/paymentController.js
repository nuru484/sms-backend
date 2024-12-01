// src/controllers/paymentController.js
import { validationResult } from 'express-validator'; // Import for validation
import { processMomoPaymentStatus } from '../services/paymentServices.js';
import logger from '../utils/logger.js';
import { processMomoPayment } from '../services/paymentServices.js';
import moMoApiAccessToken from '../services/createMoMoApiAccessToken.js';

const initializeMomoTransaction = async (req, res, next) => {
  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors to the client
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, externalId, payerId, payerMessage, payeeNote } =
      req.body;

    // Log the request
    logger.info({ 'Initializing MoMo Transaction': { requestBody: req.body } });

    // Retrieve access token
    const accessToken = await moMoApiAccessToken();
    logger.info('Successfully retrieved MoMo API access token.');

    // Process the payment
    const response = await processMomoPayment(
      accessToken,
      amount,
      currency,
      externalId,
      payerId,
      payerMessage,
      payeeNote
    );

    // Respond with success
    logger.info('MoMo transaction initialized successfully', { response });
    return res.status(200).json({ ...response });
  } catch (error) {
    logger.error('Error in initializeMomoTransaction', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
    });

    next(error);
  }
};

const paymentCallback = async (req, res, next) => {
  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors to the client
      return res.status(400).json({ errors: errors.array() });
    }

    const paymentDetails = req.body;

    const response = await processMomoPaymentStatus(paymentDetails);

    return res.status(200).json(response);
  } catch (error) {
    logger.error('Error in payment callback', { error });
    next(error);
  }
};

export { initializeMomoTransaction, paymentCallback };
