// src/controllers/paymentController.js
import { processMomoPaymentStatus } from '../services/paymentServices.js';
import logger from '../utils/logger.js';
import { processMomoPayment } from '../services/paymentServices.js';
import moMoApiAccessToken from '../services/createMoMoApiAccessToken.js';

const initializeMomoTransaction = async (req, res, next) => {
  try {
    // Validate the request body
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn('Request body is missing or empty.');
      return res
        .status(400)
        .json({ error: 'Request body is missing or empty.' });
    }

    const { amount, currency, externalId, payerId, payerMessage, payeeNote } =
      req.body;

    // Validate required fields
    if (!amount || !currency || !externalId || !payerId) {
      logger.warn({
        'Missing required fields in the request body.': {
          body: req.body,
        },
      });
      return res.status(400).json({
        error:
          'Missing required fields: amount, currency, externalId, or payerId.',
      });
    }

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
    const paymentDetails = req.body;

    const response = await processMomoPaymentStatus(paymentDetails);

    return res.status(200).json(response);
  } catch (error) {
    logger.error('Error in payment callback', { error });
    next(error);
  }
};

export { initializeMomoTransaction, paymentCallback };
