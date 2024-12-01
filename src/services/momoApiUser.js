// src/services/momoApiUser.js
import { v4 as uuidv4 } from 'uuid';
import ENV from '../config/env.js';
import logger from '../utils/logger.js';
import { CustomError } from '../utils/middleware/errorHandler.js';

/**
 * Create or retrieve the MTN MoMo API user.
 */
const createMoMoApiUser = async () => {
  const referenceId = uuidv4();
  const headers = {
    'X-Reference-Id': referenceId,
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key,
  };

  const body = JSON.stringify({
    providerCallbackHost: 'hkdk.events',
  });

  try {
    const response = await fetch(ENV.MTN_MOMO_API_USER_URL, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    console.log(response);

    if (response.status === 201) {
      logger.info('User created successfully.');
      return { referenceId, providerCallbackHost: 'hkdk.events' };
    } else if (response.status === 409) {
      logger.info('User already exists.');
      throw new CustomError(409, 'User already exists');
    } else {
      const errorData = await response.json();
      logger.error('Error creating user:', errorData);
      throw new CustomError(response.status, errorData.message);
    }
  } catch (error) {
    logger.error('Request failed:', error);
    throw new CustomError(
      500,
      `Failed to create MoMo API user. ${error.message}`
    );
  }
};

/**
 * Create or retrieve an API key for the given API user.
 */
const createMoMoApiKey = async (referenceId) => {
  const apiUrl = ENV.MTN_MOMO_API_KEY_URL.replace(
    '{X-Reference-Id}',
    referenceId
  );

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key,
      },
    });

    if (response.status === 201) {
      const data = await response.json();
      return data.apiKey;
    } else {
      const errorData = await response.json();
      logger.error('Error creating API key:', errorData);
      throw new CustomError(response.status, errorData.message);
    }
  } catch (error) {
    logger.error('Request failed:', error);
    throw new CustomError(500, 'Failed to create MoMo API key');
  }
};

/**
 * Create an access token for MoMo API using the API user ID and API key.
 */
const createAccessToken = async (referenceId, apiKey) => {
  const authHeader = Buffer.from(`${referenceId}:${apiKey}`).toString('base64');

  try {
    const response = await fetch(ENV.MTN_MOMO_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key,
      },
    });

    if (response.status === 200) {
      const tokenData = await response.json();
      return tokenData.access_token;
    } else {
      const errorData = await response.json();
      logger.error('Error creating access token:', errorData);
      throw new CustomError(response.status, 'Unauthorized');
    }
  } catch (error) {
    logger.error('Request failed:', error);
    throw new CustomError(500, 'Failed to create access token');
  }
};

export { createMoMoApiUser, createMoMoApiKey, createAccessToken };
