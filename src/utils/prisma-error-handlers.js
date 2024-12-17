// src/utils/prisma-error-handlers.js

import { CustomError } from './middleware/errorHandler.js';

/**
 * Handles Prisma unique constraint violation error (P2002).
 *
 * @param {Error} error - The Prisma error object.
 * @throws {CustomError} - A formatted error with a 400 status code.
 */
export const handleDuplicateError = (error) => {
  if (error.code === 'P2002') {
    const target = error.meta?.target || 'unknown field';
    throw new CustomError(
      400,
      `Duplicate value found for /${target}/. Please provide a unique value.`
    );
  }

  // If the error is not P2002, rethrow for fallback handling
  throw error;
};

/**
 * Handles Prisma "record not found" error (P2025).
 *
 * @param {Error} error - The Prisma error object.
 * @param {string} resourceName - The name of the resource being fetched/updated/deleted.
 * @throws {CustomError} - A formatted error with a 404 status code.
 */
export const handleNotFoundError = (error, resourceName = 'Resource') => {
  if (error.code === 'P2025') {
    throw new CustomError(404, `/${resourceName}/ not found.`);
  }

  // If the error is not P2025, rethrow for fallback handling
  throw error;
};

/**
 * Handles Prisma errors based on their specific error codes.
 *
 * @param {Error} error - The Prisma error object.
 * @param {string} resourceName - The name of the resource being fetched/updated/deleted.
 * @throws {CustomError} - Throws a formatted error based on the Prisma error code.
 */
export const handlePrismaError = (error, resourceName = 'Resource') => {
  // Switch on Prisma-specific error codes
  switch (error.code) {
    case 'P2002': // Unique constraint violation
      handleDuplicateError(error);
      break;

    case 'P2025': // Record not found
      handleNotFoundError(error, resourceName);
      break;

    // Extend this block for other Prisma error codes as needed
    case 'P2014': // Related record not found
      throw new CustomError(
        400,
        `Related record missing for the operation on /${resourceName}/.`
      );

    case 'P2016': // Record required but not found
      throw new CustomError(
        404,
        `The required /${resourceName}/ record does not exist.`
      );

    case 'P2018': // Missing required field in a relation
      throw new CustomError(
        400,
        `The /${resourceName}/ record is missing a required field for the operation.`
      );

    default:
      // Re-throw unknown errors to avoid masking unexpected issues
      throw error;
  }
};
