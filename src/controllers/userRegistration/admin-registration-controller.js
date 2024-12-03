import logger from '../../utils/logger.js';
import processAdminRegistration from '../../services/userRegistration/admin-registration-service.js';

export const registerAdmin = async (req, res, next) => {
  const adminRegistrationPayload = req.body;
  try {
    const response = await processAdminRegistration(adminRegistrationPayload);

    return res.status(201).json(response);
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error during admin registration!': { error: error.message },
    });

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
