// src/repositories/transactionRepository.js

// Import the Prisma client for database interactions
import prisma from '../../../prismaClient.js';

// Import Prisma-specific error handling class
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Import logger for structured and consistent logging
import logger from '../../utils/logger.js';

// Import custom error handler for application-specific error management
import { CustomError } from '../../utils/middleware/errorHandler.js';

/**
 * Creates a new MoMo (Mobile Money) transaction record in the database.
 *
 * Validates the input payment details, ensures data integrity, and handles potential database errors.
 *
 * @param {Object} paymentDetails - The details of the payment transaction.
 * @param {string} paymentDetails.accessToken - Authentication token for the transaction.
 * @param {number} paymentDetails.amount - The transaction amount.
 * @param {string} paymentDetails.currency - The currency code (e.g., 'USD').
 * @param {string} paymentDetails.partyId - The ID of the payer.
 * @param {string} paymentDetails.referenceId - Unique identifier for the transaction.
 * @param {string} paymentDetails.status - The status of the transaction (e.g., 'Pending').
 * @returns {Promise<void>}
 * @throws {CustomError} If validation fails or a database error occurs.
 */
export const createMomoTransaction = async (paymentDetails) => {
  try {
    // Log transaction details for traceability
    logger.info('Creating MoMo transaction in the database', {
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      partyId: paymentDetails.partyId,
      referenceId: paymentDetails.referenceId,
      status: paymentDetails.status,
      externalId: paymentDetails.externalId,
      partyIdType: paymentDetails.partyIdType,
      payerMessage: paymentDetails.payerMessage,
      payeeNote: paymentDetails.payeeNote,
    });

    // Create a new transaction record in the database
    await prisma.mobileMoneyTransaction.create({
      data: {
        accessToken: paymentDetails.accessToken,
        amount: parseFloat(paymentDetails.amount), // Ensure the amount is a valid float
        currency: paymentDetails.currency,
        partyId: paymentDetails.partyId,
        externalId: paymentDetails.externalId,
        referenceId: paymentDetails.referenceId,
        status: paymentDetails.status,
        transactionDate: new Date(), // Automatically sets the transaction date
        partyIdType: paymentDetails.partyIdType,
        payerMessage: paymentDetails.payerMessage,
        payeeNote: paymentDetails.payeeNote,
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
    throw error;
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
export const updateMomoTransactionStatus = async (externalId, updateData) => {
  try {
    // Update the transaction record in the database
    const transaction = await prisma.mobileMoneyTransaction.update({
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
    throw error;
  }
};
