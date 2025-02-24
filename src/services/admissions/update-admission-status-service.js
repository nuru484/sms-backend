// src/services/admissions/update-admission-status-service.js
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { updateAdmissionStatus } from '../../repositories/admissions/updateAdmissionStatusRepository.js';
import { client } from '../../config/redis.js';

// Service function to handle updating the admission status
export const updateStudentAdmissionStatus = async (
  studentId,
  admissionStatus
) => {
  try {
    // Call the repository to update the admission status
    const updatedStudent = await updateAdmissionStatus(
      studentId,
      admissionStatus
    );

    // Invalidate the cache
    const studentDetailsCacheKey = `student:${studentId}`;
    await client.del(studentDetailsCacheKey);

    // Return the updated student object
    return updatedStudent;
  } catch (error) {
    // Rethrow the error to be handled by the controller or higher layers
    handlePrismaError(error, 'Student');
  }
};
