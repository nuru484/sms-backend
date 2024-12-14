// src/services/admissions/update-admission-status-service.js

// Import the repository function
import { updateAdmissionStatus } from '../../repositories/admissions/updateAdmissionStatusRepository.js';

import logger from '../../utils/logger.js'; // Logger for logging operations

// Service function to handle updating the admission status
export const updateStudentAdmissionStatus = async (userId, admissionStatus) => {
  try {
    // Log the attempt to update the admission status
    logger.info(
      `Attempting to update admission status for student with userId: ${userId}`
    );

    // Call the repository to update the admission status
    const updatedStudent = await updateAdmissionStatus(userId, admissionStatus);

    // Log the successful update
    logger.info(
      `Admission status updated successfully for student with userId: ${userId}`
    );

    // Return the updated student object
    return updatedStudent;
  } catch (error) {
    // Log the error in case of failure
    logger.error({
      'Error updating admission status': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Rethrow the error to be handled by the controller or higher layers
    throw error;
  }
};
