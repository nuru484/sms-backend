// src/services/auth/login-service.js

import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByUsernameAndUpdateToken } from '../../repositories/auth/login-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import ENV from '../../config/env.js';

/**
 * Handles user login logic.
 *
 * @param {Object} credentials - The login credentials containing username and password.
 * @returns {Promise<Object>} - An object containing access and refresh tokens.
 * @throws {CustomError} - Throws an error for invalid credentials or other issues.
 */
export const loginUser = async ({ username, password }) => {
  try {
    // Step 1: Find the user by username
    const user = await findUserByUsernameAndUpdateToken(username);

    if (!user) {
      throw new CustomError(400, 'User not found');
    }

    // Step 2: Compare passwords
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError(401, 'Invalid credentials');
    }

    // Step 3: Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      ENV.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m',
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      ENV.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    );

    // Step 4: Update the user's refresh token in the database
    await findUserByUsernameAndUpdateToken(username, refreshToken);

    // Step 5: Return the tokens
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error({
      'Service error': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Rethrow the error to propagate it
    throw error;
  }
};
