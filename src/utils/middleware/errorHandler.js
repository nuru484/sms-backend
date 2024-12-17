// src/utils/middleware/errorHandler.js

import logger from '../logger.js';
import ENV from '../../config/env.js';

/**
 * CustomError class to standardize error handling with status codes and messages.
 * Extends the built-in Error class to include a status code.
 */
export class CustomError extends Error {
  constructor(status, message, layer = 'unknown') {
    super(message);
    this.status = status;
    this.layer = layer; // Track which layer the error occurred in
  }
}

/**
 * Error-handling middleware to catch and format errors in the application.
 *
 * This function intercepts errors thrown in the application and formats
 * them into a standardized JSON response.
 */
export const handleError = (error, req, res, next) => {
  const isProduction = ENV.NODE_ENV === 'production';

  // Log the error here, centralized logging
  logger.error({
    message: error.message,
    error,
    stack: !isProduction ? error.stack : undefined,
    body: req.body,
  });

  // Check if the error is an instance of CustomError
  if (error instanceof CustomError) {
    // Return a response with the status and message from the CustomError
    return res.status(error.status).json({ message: error.message });
  }

  // For non-CustomError errors, send a generic 500 internal server error response
  res.status(error.status || 500).json(error || 'Internal Server Error');
};
