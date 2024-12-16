// src/repositories/student/student-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

// Helper function to get student details by userId
export const getStudentByUserId = async (id) => {
  try {
    // Fetch the student record based on userId
    const student = await prisma.student.findUnique({
      where: { id }, // Lookup student by userId
      include: {
        user: true, // Include related user data, if needed
        level: true, // Include the level of the student (optional)
      },
    });

    if (!student) {
      // If no student is found, throw a custom error
      throw new CustomError(404, `Student with id ${id} not found.`);
    }

    return student;
  } catch (error) {
    // Log error if any issue occurs
    logger.error({
      'Error fetching student by id': {
        error: error.message,
        stack: error.stack,
      },
    });

    throw error;
  }
};
