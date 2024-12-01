// src/services/paymentServices.js
import logger from '../utils/logger.js';
import { CustomError } from '../utils/middleware/errorHandler.js';
import { requestToPay } from './requestToPay.js';
import { updateMomoTransactionStatus } from '../repositories/transactionRepository.js';
import { createMomoTransaction } from '../repositories/transactionRepository.js';

const processMomoPayment = async (
  accessToken,
  amount,
  currency,
  externalId,
  payerId,
  payerMessage,
  payeeNote
) => {
  // Validate inputs
  if (!accessToken || !amount || !currency || !externalId || !payerId) {
    throw new CustomError(
      400,
      'Missing required parameters for processing payment'
    );
  }

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
    // Try to make the request to MoMo API
    const requestToPayResponse = await requestToPay(
      accessToken,
      amount,
      currency,
      externalId,
      payerId,
      payerMessage,
      payeeNote
    );

    const paymentDetails = {
      accessToken,
      amount: parseFloat(amount),
      currency,
      externalId,
      payerId,
      payerMessage,
      payeeNote,
      referenceId: requestToPayResponse.referenceId,
      status: requestToPayResponse.status,
    };

    await createMomoTransaction(paymentDetails);

    // Successful response logging
    logger.info({
      'MoMo payment processed successfully': {
        payerId,
        externalId,
        response: requestToPayResponse,
      },
    });

    return requestToPayResponse;
  } catch (error) {
    logger.error({
      'Error processing MoMo payment': {
        error: error.message,
        stack: error.stack,
        details: { payerId, amount, externalId, currency },
      },
    });

    throw new CustomError(
      500,
      `Failed to process MoMo payment: ${error.message}`
    );
  }
};

const processMomoPaymentStatus = async (paymentDetails) => {
  const { payer, status, financialTransactionId, reason, externalId } =
    paymentDetails;

  logger.info('Processing payment status', { payer, status });

  try {
    if (status === 'SUCCESSFUL') {
      await updateMomoTransactionStatus(externalId, {
        status,
        financialTransactionId,
      });
      return {
        message: 'Payment processed successfully.',
        status,
        financialTransactionId,
      };
    } else {
      await updateMomoTransactionStatus(externalId, {
        status,
        details: reason || 'No reason provided',
      });
      return {
        message: 'Payment recorded, but not completed.',
        status,
        reason,
      };
    }
  } catch (error) {
    logger.error({
      'Error processing Transaction status': {
        error: error.message,
        stack: error.stack,
      },
    });

    throw new CustomError(
      500,
      `Failed to process Transaction: ${error.message}`
    );
  }
};

export { processMomoPayment, processMomoPaymentStatus };
