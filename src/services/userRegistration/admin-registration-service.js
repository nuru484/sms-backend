// src/services/userRegistration/admin-registration-service.js

// Import necessary functions and utilities
import {
  createUserBasicDetails,
  createUserAddress as createAdminAddress,
} from '../../repositories/userRegistration/general-user-registration-repository.js';

import logger from '../../utils/logger.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import prisma from '../../config/prismaClient.js';

/**
 * Service function to handle admin registration logic.
 *
 * @param {Object} payload - The payload containing admin registration details.
 * @returns {Promise<Object>} - Returns a success message if registration is successful.
 * @throws {CustomError} - Throws an error if any step in the process fails.
 */
const processAdminRegistration = async (payload) => {
  const {
    firstName,
    middleName,
    lastName,
    profilePhoto,
    gender,
    role,
    username,
    email,
    phoneNumber,
    password,
    confirmPassword,
    city,
    country,
    region,
    postalCode,
    digitalAddress,
  } = payload;

  try {
    // Using Prisma's transaction to ensure all database operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create Admin User Record (basic details)
      const admin = await createUserBasicDetails({
        firstName,
        middleName,
        lastName,
        profilePhoto,
        gender,
        role,
        username,
        email,
        phoneNumber,
        password, // Assuming password is hashed before being passed
        confirmPassword,
        tx, // Pass transaction object to repository
      });

      logger.info({ 'Admin user record successfully created': admin });

      // Step 2: Create Admin Address using the created user ID
      const adminAddress = await createAdminAddress({
        city,
        country,
        region,
        postalCode,
        digitalAddress,
        userId: admin.id, // Use the ID from the created admin user
        tx, // Pass transaction object to repository
      });

      logger.info('Admin address successfully created.');

      // Return success message
      return {
        message: 'Admin registration successful.',
      };
    });

    return result; // Return the result of the transaction
  } catch (error) {
    // Log error details if registration fails
    logger.error({
      'Error processing admin registration': {
        context: 'processAdminRegistration', // Context to help identify where the error occurred
        payload: {
          firstName,
          middleName,
          lastName,
          username,
          email,
          city,
          country,
          region,
          digitalAddress,
          phoneNumber,
        },
        errorDetails: {
          errorMessage: error.message,
          errorCode: error.code,
          errorStack: error.stack,
          errorMeta: error.meta,
        },
      },
    });

    // Throw a custom error with a user-friendly message
    throw new CustomError(500, `Admin registration failed: ${error.message}`);
  }
};

// Export the processAdminRegistration function for use in other parts of the application
export default processAdminRegistration;
