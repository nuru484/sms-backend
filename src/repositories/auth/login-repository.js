// src/repositories/auth/login-repository.js

import prisma from '../../../prismaClient.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

/**
 * Finds a user by their username and optionally updates their refresh token.
 *
 * @param {string} username - The username of the user to find.
 * @param {string|null} refreshToken - The new refresh token to update (optional).
 * @returns {Promise<Object>} - The user record if found.
 * @throws {CustomError} - Throws an error if the user is not found or there's a database error.
 */
export const findUserByUsernameAndUpdateToken = async (
  username,
  refreshToken = null
) => {
  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new CustomError(
        404,
        `User with this username: ${username} not found`
      );
    }

    // If a refresh token is provided, update the user record
    if (refreshToken) {
      await prisma.user.update({
        where: { username },
        data: { refreshToken },
      });
    }

    return user;
  } catch (error) {
    logger.error({
      'Database error': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw new CustomError(500, `Error finding user: ${error.message}`);
  }
};
