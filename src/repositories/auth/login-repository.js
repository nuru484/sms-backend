// src/repositories/auth/login-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

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

    // If a refresh token is provided, update the user record
    if (refreshToken) {
      await prisma.user.update({
        where: { username },
        data: { refreshToken },
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};
