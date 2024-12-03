// src/controllers/userRegistration/admin-registration-controller.js

// Import the logger utility to log important information and errors.
import logger from '../../utils/logger.js';

// Import the service responsible for handling the admin registration logic.
import processAdminRegistration from '../../services/userRegistration/admin-registration-service.js';

/**
 * Controller function to handle the registration of an admin user.
 *
 * @param {Object} req - Express request object containing the admin registration data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the registration
 * or delegates error handling to the next middleware.
 */
export const registerAdmin = async (req, res, next) => {
  const adminRegistrationPayload = req.body; // Extract the registration payload from the request body.

  try {
    // Call the service function to process the admin registration.
    const response = await processAdminRegistration(adminRegistrationPayload);

    // Send a success response with a 201 status code indicating resource creation.
    return res.status(201).json(response);
  } catch (error) {
    // Log detailed error information for monitoring and debugging purposes.
    logger.error({
      'Error during admin registration!': { error: error.message },
    });

    // Pass the error to the next middleware for centralized error handling.
    next(error);
  }
};
