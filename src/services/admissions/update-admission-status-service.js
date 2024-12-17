// src/services/admissions/update-admission-status-service.js
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { updateAdmissionStatus } from '../../repositories/admissions/updateAdmissionStatusRepository.js';

// Service function to handle updating the admission status
export const updateStudentAdmissionStatus = async (userId, admissionStatus) => {
  try {
    // Call the repository to update the admission status
    const updatedStudent = await updateAdmissionStatus(userId, admissionStatus);

    // Return the updated student object
    return updatedStudent;
  } catch (error) {
    // Rethrow the error to be handled by the controller or higher layers
    handlePrismaError(error, 'Student');
  }
};
