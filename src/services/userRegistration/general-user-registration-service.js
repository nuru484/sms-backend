// src/services/userRegistration/general-user-registration-service.js

// Import necessary functions and utilities
import { createUserBasicDetails } from '../../repositories/userRegistration/general-user-registration-repository.js';
import prisma from '../../config/prismaClient.js';
import { uploadFileToCloudinary } from '../../config/claudinary.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

/**
 * Service function to handle admin registration logic.
 */
export const processUserRegistration = async (payload, profilePhoto) => {
  try {
    const profilePhotoUrl =
      profilePhoto && (await uploadFileToCloudinary(profilePhoto));

    payload.profilePhoto = profilePhotoUrl;

    // Using Prisma's transaction to ensure all database operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create User Record (basic details)
      const user = await createUserBasicDetails(payload);

      // Return success message
      return {
        message: 'User registration successful.',
      };
    });

    return result; // Return the result of the transaction
  } catch (error) {
    handlePrismaError(error, 'User Registration');
  }
};
