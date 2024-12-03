// src/services/userRegistration/admin-registration-service.js

// Import necessary functions and utilities
import { createAdmin } from '../../repositories/userRegistration/admin-registration-repository.js';
import logger from '../../utils/logger.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import prisma from '../../../prismaClient.js';

// Service function to handle admin registration logic
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
    return await prisma.$transaction(async (tx) => {
      const adminRegistrationDetails = {
        basicDetails: {
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
        },

        address: {
          city,
          country,
          region,
          postalCode,
          digitalAddress,
        },
      };

      // Log the admin registration details, ensuring sensitive data like password is masked
      logger.info({
        'Attempting to register admin with payload': {
          basicDetails: {
            ...adminRegistrationDetails.basicDetails,
            password: '******', // Masking password for security reasons
          },
          address: adminRegistrationDetails.address,
        },
      });

      // Call the repository to create admin and related data in the database
      await createAdmin(adminRegistrationDetails);

      // Return a success message if the registration completes without issues
      return {
        message: 'Admin registration successful.',
      };
    });
  } catch (error) {
    // Log error details if registration fails, including relevant context and payload information
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

    // Throw a custom error with a user-friendly message and original error details
    throw new CustomError(500, `Admin registration failed: ${error.message}`);
  }
};

// Export the processAdminRegistration function for use in other parts of the application
export default processAdminRegistration;
