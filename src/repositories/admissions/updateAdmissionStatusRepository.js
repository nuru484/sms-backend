// src/repositories/admissions/updateAdmissionStatusRepository.js

// Import necessary modules
import prisma from '../../../prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

// Helper function to update the admission status of a student by userId
export const updateAdmissionStatus = async (userId, admissionStatus) => {
  try {
    // Find the student by userId and update admission status
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(userId, 10) }, // Locate the student using userId
      data: {
        admissionStatus, // Set the new admission status
      },
    });

    if (!updatedStudent) {
      // If no student is found with the provided userId, throw a custom error
      throw new CustomError(404, `Student with userId ${userId} not found.`);
    }

    // Return the updated student details
    return updatedStudent;
  } catch (error) {
    // Log the error if any issue occurs
    logger.error({
      'Error updating admission status for student': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Rethrow the error to propagate it
    throw error;
  }
};
