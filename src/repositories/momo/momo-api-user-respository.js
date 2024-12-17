// src/repositories/momoApiUserRespository.js

// Import Prisma client for database interaction
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

// Import custom error handler for consistent error management
/**
 * Retrieves or creates MoMo API user details in the database.
 *
 * If a user with the provided referenceId and apiKey does not already exist,
 * this function creates a new entry. Otherwise, it retrieves the existing record.
 *
 * @param {string} referenceId - The unique identifier for the API user.
 * @param {string} apiKey - The API key associated with the user.
 * @returns {Promise<Object>} The user transaction record from the database.
 * @throws {CustomError} If a database error occurs during the operation.
 */
export const momoApiUserDetails = async (referenceId, apiKey) => {
  try {
    // Attempt to find an existing MoMo user transaction record in the database
    let transaction = await prisma.momoUser.findFirst();

    // If no record exists, create a new MoMo user transaction record
    if (!transaction) {
      transaction = await prisma.momoUser.create({
        data: { referenceId, apiKey }, // Populate with provided details
      });
    }

    // Return the retrieved or newly created transaction record
    return transaction;
  } catch (error) {
    // Throw a custom error for consistent error handling and logging
    throw error;
  }
};
