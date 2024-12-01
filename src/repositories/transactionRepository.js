// src/repositories/transactionRepository.js
import prisma from '../../prismaClient.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import logger from '../utils/logger.js';
import { CustomError } from '../utils/middleware/errorHandler.js';

const createMomoTransaction = async (paymentDetails) => {
  try {
    // Validate payment details
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

    if (isNaN(paymentDetails.amount) || paymentDetails.amount <= 0) {
      throw new CustomError(400, 'Invalid payment amount');
    }

    if (!/^[A-Z]{3}$/.test(paymentDetails.currency)) {
      throw new CustomError(400, 'Invalid currency format');
    }

    logger.info('Creating MoMo transaction in the database', {
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      payerId: paymentDetails.payerId,
      referenceId: paymentDetails.referenceId,
      status: paymentDetails.status,
    });

    await prisma.transaction.create({
      data: {
        accessToken: paymentDetails.accessToken,
        amount: parseFloat(paymentDetails.amount),
        currency: paymentDetails.currency,
        payerAccountNumber: paymentDetails.payerId,
        externalId: paymentDetails.externalId,
        referenceId: paymentDetails.referenceId,
        status: paymentDetails.status,
        type: 'Incoming Payment',
        transactionDate: new Date(),
      },
    });
  } catch (error) {
    logger.error(`Database error: ${error.message}`, { stack: error.stack });

    if (error.code === 'P2002') {
      // Unique constraint error in Prisma
      throw new CustomError(400, `Duplicate transaction ${error.message}`);
    }

    throw new CustomError(500, `Database error: ${error.message}`);
  }
};

const updateMomoTransactionStatus = async (externalId, updateData) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { externalId },
      data: updateData,
    });

    return transaction;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        // Record not found
        logger.error(`Transaction not found for externalId: ${externalId}`);
        throw new CustomError(
          404,
          `Transaction not found for externalId: ${externalId}`
        );
      }
    }

    // General error
    logger.error(`Database error: ${error.message}`);
    throw new CustomError(500, `Database error: ${error.message}`);
  }
};

export { createMomoTransaction, updateMomoTransactionStatus };
