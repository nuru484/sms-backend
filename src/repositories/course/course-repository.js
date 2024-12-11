// src/repositories/course/course-repository.js

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

/**
 * Repository function to update a course by its ID in the database.
 *
 * @param {number} id - The ID of the course to be updated.
 * @param {Object} updateData - The data to update (e.g., { name: 'New Name', code: 'NEW123' }).
 * @returns {Promise<Object>} - Returns the updated course object if successful.
 * @throws {CustomError} - Throws a custom error if the course is not found or if there is a database error.
 */
export const updateCourseById = async (id, updateData) => {
  try {
    // Log the attempt to update the course
    logger.info({
      'Attempting to update course': {
        courseId: id,
        updateData,
      },
    });

    // Attempt to update the course in the database
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    // Log the successful update
    logger.info({
      'Course successfully updated': {
        courseId: updatedCourse.id,
        updatedFields: updateData,
      },
    });

    return updatedCourse; // Return the updated course object
  } catch (error) {
    // Handle the case where the course is not found
    if (error.code === 'P2025') {
      logger.warn({
        'Course not found during update': { courseId: id },
      });
      throw new CustomError(404, `Course with ID ${id} not found.`);
    }

    // Log unexpected errors and rethrow them as internal server errors
    logger.error({
      'Database error during course update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};
