// src/repositories/transactionRepository.js

// Import the Prisma client for database interactions
import prisma from '../../prismaClient.js';

// Import Prisma-specific error handling class
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Import logger for structured and consistent logging
import logger from '../utils/logger.js';

// Import custom error handler for application-specific error management
import { CustomError } from '../utils/middleware/errorHandler.js';

/**
 * Creates a new MoMo (Mobile Money) transaction record in the database.
 *
 * Validates the input payment details, ensures data integrity, and handles potential database errors.
 *
 * @param {Object} paymentDetails - The details of the payment transaction.
 * @param {string} paymentDetails.accessToken - Authentication token for the transaction.
 * @param {number} paymentDetails.amount - The transaction amount.
 * @param {string} paymentDetails.currency - The currency code (e.g., 'USD').
 * @param {string} paymentDetails.payerId - The ID of the payer.
 * @param {string} paymentDetails.referenceId - Unique identifier for the transaction.
 * @param {string} paymentDetails.status - The status of the transaction (e.g., 'Pending').
 * @returns {Promise<void>}
 * @throws {CustomError} If validation fails or a database error occurs.
 */
const createMomoTransaction = async (paymentDetails) => {
  try {
    // Validate required fields in the payment details
    if (
      !paymentDetails.accessToken ||
      !paymentDetails.amount ||
      !paymentDetails.currency ||
      !paymentDetails.payerId ||
      !paymentDetails.referenceId ||
      !paymentDetails.status
    ) {
      throw new CustomError(
        400,
        'Invalid payment details: Missing required fields'
      );
    }

    // Validate the transaction amount
    if (isNaN(paymentDetails.amount) || paymentDetails.amount <= 0) {
      throw new CustomError(400, 'Invalid payment amount');
    }

    // Validate the currency format (ISO 4217, 3-letter code)
    if (!/^[A-Z]{3}$/.test(paymentDetails.currency)) {
      throw new CustomError(400, 'Invalid currency format');
    }

    // Log transaction details for traceability
    logger.info('Creating MoMo transaction in the database', {
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      payerId: paymentDetails.payerId,
      referenceId: paymentDetails.referenceId,
      status: paymentDetails.status,
    });

    // Create a new transaction record in the database
    await prisma.transaction.create({
      data: {
        accessToken: paymentDetails.accessToken,
        amount: parseFloat(paymentDetails.amount), // Ensure the amount is a valid float
        currency: paymentDetails.currency,
        payerAccountNumber: paymentDetails.payerId,
        externalId: paymentDetails.externalId,
        referenceId: paymentDetails.referenceId,
        status: paymentDetails.status,
        type: 'Incoming Payment', // Static type for the transaction
        transactionDate: new Date(), // Automatically sets the transaction date
      },
    });
  } catch (error) {
    // Log the error details for debugging
    logger.error(`Database error: ${error.message}`, { stack: error.stack });

    // Handle unique constraint errors in Prisma (e.g., duplicate transactions)
    if (error.code === 'P2002') {
      throw new CustomError(400, `Duplicate transaction: ${error.message}`);
    }

    // General error handling
    throw new CustomError(500, `Database error: ${error.message}`);
  }
};

/**
 * Updates the status of an existing MoMo transaction in the database.
 *
 * Finds a transaction by its external ID and updates it with the provided data.
 * Handles potential errors, including when the transaction is not found.
 *
 * @param {string} externalId - The unique external ID of the transaction.
 * @param {Object} updateData - The data to update in the transaction record.
 * @returns {Promise<Object>} The updated transaction record.
 * @throws {CustomError} If the transaction is not found or a database error occurs.
 */
const updateMomoTransactionStatus = async (externalId, updateData) => {
  try {
    // Update the transaction record in the database
    const transaction = await prisma.transaction.update({
      where: { externalId }, // Locate the transaction by its external ID
      data: updateData, // Apply the updates provided in updateData
    });

    // Return the updated transaction record
    return transaction;
  } catch (error) {
    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        // Record not found in the database
        logger.error(`Transaction not found for externalId: ${externalId}`);
        throw new CustomError(
          404,
          `Transaction not found for externalId: ${externalId}`
        );
      }
    }

    // General error handling for database errors
    logger.error(`Database error: ${error.message}`);
    throw new CustomError(500, `Database error: ${error.message}`);
  }
};

// Export the repository functions for use in other parts of the application
export { createMomoTransaction, updateMomoTransactionStatus };
