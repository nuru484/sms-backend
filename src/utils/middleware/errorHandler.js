// src/utils/middleware/errorHandler.js

/**
 * CustomError class to standardize error handling with status codes and messages.
 * Extends the built-in Error class to include a status code.
 */
class CustomError extends Error {
  /**
   * Creates a new instance of CustomError.
   *
   * @param {number} status - The HTTP status code associated with the error.
   * @param {string} message - A detailed message describing the error.
   */
  constructor(status, message) {
    super(message); // Call the parent class constructor with the message
    this.status = status; // Attach the status code to the error instance
  }
}

/**
 * Error-handling middleware to catch and format errors in the application.
 *
 * This function intercepts errors thrown in the application and formats
 * them into a standardized JSON response.
 *
 * @param {Error} error - The error object thrown by the application.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response} - Sends a JSON response to the client with the error details.
 */
const handleError = (error, req, res, next) => {
  // Check if the error is an instance of CustomError
  if (error instanceof CustomError) {
    // Return a response with the status and message from the CustomError
    return res.status(error.status).json({ message: error.message });
  }

  // For non-CustomError errors, send a generic 500 internal server error response
  return res
    .status(500) // Internal Server Error
    .json({ message: `Internal Server Error: ${error.message}` });
};

// Export the CustomError class and the error-handling middleware
export { CustomError, handleError };
