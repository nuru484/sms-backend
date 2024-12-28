// src/controllers/student/admission-status-controller.js

import { updateStudentAdmissionStatus } from '../../services/admissions/update-admission-status-service.js';
import logger from '../../utils/logger.js'; // Logger utility for structured logging

export const updateAdmissionStatus = async (req, res, next) => {
  try {
    // Extract admission status from the request body
    const { admissionStatus } = req.body;

    // Extract userId from the request parameters
    const { studentId } = req.params;

    // Call the service layer to handle the logic for updating the admission status
    const updatedStudent = await updateStudentAdmissionStatus(
      studentId,
      admissionStatus
    );

    // Log the successful transaction
    logger.info(
      `Admission status successfully updated for student with ID: ${studentId}`
    );

    // Respond to the client with the updated student details
    return res.status(200).json({
      message: 'Admission status updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
