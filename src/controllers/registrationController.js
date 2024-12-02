import processStudentRegistration from '../services/userRegistrationServices.js/studentRegistrationService.js';
import logger from '../utils/logger.js';

const registerStudent = async (req, res, next) => {
  const studentRegistrationPayload = req.body;
  try {
    const response = await processStudentRegistration(
      studentRegistrationPayload
    );

    return res.status(201).json(response);
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({ 'Error during student registration!': { error } });

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};

export { registerStudent };
