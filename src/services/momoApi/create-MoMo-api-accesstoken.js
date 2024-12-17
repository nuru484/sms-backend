// Importing the logger utility for logging application events and errors

// Importing repository functions to interact with the MoMo API user details
import { momoApiUserDetails } from '../../repositories/momo/momo-api-user-respository.js';

// Importing service functions for creating MoMo API users, keys, and access tokens
import {
  createAccessToken, // Generates an access token using MoMo API credentials
  createMoMoApiUser, // Creates a new MoMo API user and returns its reference ID
  createMoMoApiKey, // Generates an API key for the given MoMo API user
} from './momo-api-user.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

/**
 * Service to manage MoMo API access token generation.
 * - Creates a MoMo API user if needed.
 * - Generates an API key for the user.
 * - Retrieves the API user details and uses them to create an access token.
 *
 * @returns {Promise<string>} - The generated MoMo API access token.
 */
const moMoApiAccessToken = async () => {
  try {
    // Step 1: Create a new MoMo API user and get the reference ID
    const apiUser = await createMoMoApiUser();

    // Step 2: Generate an API key for the created user
    const apiKey = await createMoMoApiKey(apiUser.referenceId);

    // Step 3: Retrieve details of the MoMo API user using the reference ID and API key
    const momoApiUser = await momoApiUserDetails(apiUser.referenceId, apiKey);

    // Step 4: Extract the reference ID and API key from the user details
    const momoReferenceId = momoApiUser.referenceId;
    const momoApiKey = momoApiUser.apiKey;

    // Step 5: Use the reference ID and API key to generate an access token
    const accessToken = await createAccessToken(momoReferenceId, momoApiKey);

    // Return the generated access token
    return accessToken;
  } catch (error) {
    handlePrismaError(error, 'Create Momo API access token');
  }
};

// Exporting the service function to be used in other parts of the application
export default moMoApiAccessToken;
