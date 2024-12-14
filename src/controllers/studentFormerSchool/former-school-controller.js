// src/controllers/studentFormerSchool/former-school-controller.js

import { createFormerSchoolForStudent } from '../../services/studentFormerSchool/former-school-services.js';
import logger from '../../utils/logger.js'; // Logger utility for structured logging

export const createFormerSchool = async (req, res, next) => {
  try {
    // Extract required data from the request body
    const {
      name,
      address,
      contactNumber,
      email,
      schoolType,
      startDate,
      endDate,
      reasonForLeaving,
    } = req.body;

    // Extract userId from the request parameters
    const { userId } = req.params;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to create former school details at controller layer': {
        userId,
        formerSchoolData: req.body,
      },
    });

    // Call the service layer to handle the logic for creating former school details
    const formerSchool = await createFormerSchoolForStudent(userId, {
      name,
      address,
      contactNumber,
      email,
      schoolType,
      startDate,
      endDate,
      reasonForLeaving,
    });

    // Log the successful transaction
    logger.info({
      'Former school details successfully created at controller layer': {
        formerSchoolId: formerSchool.id,
      },
    });

    // Respond to the client with the created former school details
    return res.status(201).json({
      message: 'Former school details created successfully',
      formerSchool,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in createFormerSchool controller': {
        error: error.message,
        stack: error.stack,
        requestBody: req.body,
      },
    });

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
