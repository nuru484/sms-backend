// src/controllers/userRegistration/student-registration-controller.js

// Import the logger utility for logging errors and other relevant information.
import logger from '../../utils/logger.js';

// Import the service responsible for processing the student registration logic.
import processStudentRegistration from '../../services/userRegistration/student-registration-service.js';

/**
 * Controller function to handle the registration of a student user.
 *
 * @param {Object} req - Express request object containing the student registration data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the registration result
 * or forwards the error to centralized error handling middleware.
 */
export const registerStudent = async (req, res, next) => {
  // Extract the student registration data from the request body.
  const studentRegistrationPayload = req.body;

  try {
    // Call the service function to handle the business logic of student registration.
    const response = await processStudentRegistration(
      studentRegistrationPayload
    );

    // Respond with a success status and the result of the registration process.
    return res.status(201).json(response);
  } catch (error) {
    // Log detailed error information for debugging and operational insights.
    logger.error({ 'Error during student registration!': { error } });

    // Delegate the error to the next middleware for centralized handling.
    next(error);
  }
};
