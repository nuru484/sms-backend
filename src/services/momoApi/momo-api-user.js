// Importing necessary modules
import { v4 as uuidv4 } from 'uuid'; // For generating unique reference IDs
import ENV from '../../config/env.js'; // Environment variables for configuration
import logger from '../../utils/logger.js'; // Logger utility for logging events and errors
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error class for standardized error handling

/**
 * Creates or retrieves the MTN MoMo API user.
 *
 * @returns {Promise<Object>} - The reference ID and provider callback host.
 * @throws {CustomError} - If user creation fails or user already exists.
 */
const createMoMoApiUser = async () => {
  const referenceId = uuidv4(); // Generate a unique reference ID
  const headers = {
    'X-Reference-Id': referenceId,
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': ENV.Ocp_Apim_Subscription_Key, // Subscription key from environment variables
  };

  const body = JSON.stringify({
    providerCallbackHost: 'hkdk.events', // Callback host URL for notifications
  });

  try {
    // Make a POST request to create the MoMo API user
    const response = await fetch(ENV.MTN_MOMO_API_USER_URL, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    // Handle response statuses
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
 * Generates an API key for a given MoMo API user.
 *
 * @param {string} referenceId - The unique reference ID of the API user.
 * @returns {Promise<string>} - The generated API key.
 * @throws {CustomError} - If the API key creation fails.
 */
const createMoMoApiKey = async (referenceId) => {
  // Replace placeholder in the API URL with the reference ID
  const apiUrl = ENV.MTN_MOMO_API_KEY_URL.replace(
    '{X-Reference-Id}',
    referenceId
  );

  try {
    // Make a POST request to generate the API key
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
 * Generates an access token for the MoMo API.
 *
 * @param {string} referenceId - The unique reference ID of the API user.
 * @param {string} apiKey - The API key for the user.
 * @returns {Promise<string>} - The generated access token.
 * @throws {CustomError} - If the access token creation fails.
 */
const createAccessToken = async (referenceId, apiKey) => {
  // Create a Basic Authentication header
  const authHeader = Buffer.from(`${referenceId}:${apiKey}`).toString('base64');

  try {
    // Make a POST request to generate the access token
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

// Exporting the functions for external use in other parts of the application
export { createMoMoApiUser, createMoMoApiKey, createAccessToken };
