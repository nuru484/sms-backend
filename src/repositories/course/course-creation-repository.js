// src/repositories/course/course-creation-repository.js

// Import necessary modules
import prisma from '../../../prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

/**
 * Repository function to create a single course in the database.
 *
 * @param {Object} courseData - Object containing course details like name and code.
 * @returns {Promise<Object>} - Returns the created course object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createCourse = async ({ name, code }) => {
  try {
    // Log the attempt to create a course in the database
    logger.info({
      'Attempting to create course in the database': {
        courseData: { name, code },
      },
    });

    // Create the course record in the database using Prisma
    const course = await prisma.course.create({
      data: { name, code },
    });

    // Log the successful creation of the course
    logger.info({
      'Course successfully created in the database.': {
        courseId: course.id,
      },
    });

    return course; // Return the created course object
  } catch (error) {
    // Log any errors encountered during the course creation process
    logger.error({
      'Database error during course creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate course details: ${error.meta?.target || error.message}`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};
