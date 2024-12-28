// src/repositories/admissions/updateAdmissionStatusRepository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

// Helper function to update the admission status of a student by studentId
export const updateAdmissionStatus = async (studentId, admissionStatus) => {
  try {
    // Find the student by studentId and update admission status
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(studentId, 10) }, // Locate the student using studentId
      data: {
        admissionStatus, // Set the new admission status
      },
    });

    // Return the updated student details
    return updatedStudent;
  } catch (error) {
    // Rethrow the error to propagate it
    throw error;
  }
};
