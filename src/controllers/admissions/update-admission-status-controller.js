// src/controllers/student/admission-status-controller.js

import { updateStudentAdmissionStatus } from '../../services/admissions/update-admission-status-service.js';
import logger from '../../utils/logger.js'; // Logger utility for structured logging

export const updateAdmissionStatus = async (req, res, next) => {
  try {
    // Extract admission status from the request body
    const { admissionStatus } = req.body;

    console.log('this is the admission status' + admissionStatus);

    // Extract userId from the request parameters
    const { userId } = req.params;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to update admission status at controller layer': {
        userId,
        admissionStatus,
      },
    });

    // Call the service layer to handle the logic for updating the admission status
    const updatedStudent = await updateStudentAdmissionStatus(
      userId,
      admissionStatus
    );

    // Log the successful transaction
    logger.info({
      'Admission status successfully updated at controller layer': {
        userId,
        admissionStatus,
      },
    });

    // Respond to the client with the updated student details
    return res.status(200).json({
      message: 'Admission status updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in updateAdmissionStatus controller': {
        error: error.message,
        stack: error.stack,
        requestBody: req.body,
      },
    });

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
