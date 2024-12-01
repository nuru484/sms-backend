// src/services/requestToPay.js

import { v4 as uuidv4 } from 'uuid';
import ENV from '../config/env.js';
import logger from '../utils/logger.js';
import { CustomError } from '../utils/middleware/errorHandler.js';

/**
 * Request a payment to MoMo API.
 */
const requestToPay = async (
  accessToken,
  amount,
  currency,
  externalId,
  payerId,
  payerMessage,
  payeeNote
) => {
  const referenceId = uuidv4();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Callback-Url': 'http://hkdk.events/xanuc5qainshjl',
    'X-Reference-Id': referenceId,
    'X-Target-Environment': ENV.MTN_MOMO_TARGET_ENVIRONMENT,
    'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    amount,
    currency,
    externalId,
    payer: { partyIdType: 'MSISDN', partyId: payerId },
    payerMessage,
    payeeNote,
  });

  try {
    const response = await fetch(ENV.MTN_MOMO_REQUEST_TO_PAY_URL, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (response.status === 202) {
      logger.info('Request to Pay accepted and pending approval.');
      return {
        response: 'Successful',
        message: 'Request to Pay accepted and pending approval.',
        status: 'PENDING',
        referenceId,
      };
    } else {
      const errorData = await response.json();
      logger.error({ 'Error in Request to Pay': errorData });
      throw new CustomError(response.status, errorData.message);
    }
  } catch (error) {
    logger.error('Request failed:', error);
    throw new CustomError(
      error.status,
      `Failed to initialise payment ${error.message}`
    );
  }
};

/**
 * Check the status of a payment request.
 */
const checkRequestToPayStatus = async (accessToken, referenceId) => {
  const url = `${ENV.REQUEST_TO_PAY_STATUS_URL}/${referenceId}`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'X-Target-Environment': ENV.MTN_MOMO_TARGET_ENVIRONMENT,
    'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key,
  };

  try {
    const response = await fetch(url, { method: 'GET', headers: headers });

    if (response.status === 200) {
      const statusData = await response.json();
      logger.info('Transaction Status Data:', statusData);
      return statusData;
    } else {
      const errorData = await response.json();
      logger.error('Error checking status:', errorData);
      throw new CustomError(response.status, errorData.message);
    }
  } catch (error) {
    logger.error('Request failed:', error);
    throw new CustomError(error.status, 'Failed to check payment status');
  }
};

export { requestToPay, checkRequestToPayStatus };
