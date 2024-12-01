// src/services/moMoApiAccessToken.js
import logger from '../utils/logger.js';
import { CustomError } from '../utils/middleware/errorHandler.js';
import { momoApiUserDetails } from '../repositories/momoApiUserRespository.js';
import {
  createAccessToken,
  createMoMoApiUser,
  createMoMoApiKey,
} from './momoApiUser.js';

const moMoApiAccessToken = async () => {
  try {
    const apiUser = await createMoMoApiUser();
    const apiKey = await createMoMoApiKey(apiUser.referenceId);

    const momoApiUser = await momoApiUserDetails(apiUser.referenceId, apiKey);

    const momoReferenceId = momoApiUser.referenceId;
    const momoApiKey = momoApiUser.apiKey;

    const accessToken = await createAccessToken(momoReferenceId, momoApiKey);

    return accessToken;
  } catch (error) {
    logger.info(error);
    throw new CustomError(
      500,
      `Failed to process MoMo payment: ${error.message}`
    );
  }
};

export default moMoApiAccessToken;
