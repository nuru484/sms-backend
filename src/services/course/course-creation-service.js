// src/services/course/course-creation-service.js

import { createCourse } from '../../repositories/course/course-creation-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import prisma from '../../../prismaClient.js';

/**
 * Service function to create a single course.
 *
 * @param {Object} courseData - Object containing course details like name and code.
 * @returns {Promise<Object>} - Returns the created course object.
 * @throws {CustomError} - Throws an error if course creation fails.
 */
export const createSingleCourse = async (courseData) => {
  const { name, code } = courseData;

  try {
    // Log the course creation attempt
    logger.info(`Attempting to create a single course: ${name}`);

    // Call the repository to create the course
    const course = await createCourse({ name, code });

    // Log the success
    logger.info(`Course created successfully: ${course.id}`);

    return course;
  } catch (error) {
    // Log the error
    logger.error({
      'Error creating single course': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a custom error
    throw new CustomError(500, `Course creation failed: ${error.message}`);
  }
};

/**
 * Service function to create multiple courses.
 *
 * @param {Array<Object>} courses - Array of course objects, each containing `name` and `code`.
 * @returns {Promise<Array<Object>>} - Returns an array of created course objects.
 * @throws {CustomError} - Throws an error if any course creation fails.
 */
export const createMultipleCourses = async (courses) => {
  try {
    // Validate input is an array
    // if (!Array.isArray(courses)) {
    //   throw new CustomError(400, 'Input must be an array of course objects');
    // }

    // Log the batch course creation attempt
    logger.info(
      `Attempting to create multiple courses: ${courses.length} courses`
    );

    const coursePromises = courses.map((course) => {
      return prisma.course.create({
        data: course,
      });
    });

    // Use $transaction to run all Prisma Client promises in a transaction
    const createdCourses = await prisma.$transaction(coursePromises);

    // Log the success
    logger.info(`Successfully created ${createdCourses.length} courses.`);

    return createdCourses;
  } catch (error) {
    // Log the error
    logger.error({
      'Error creating multiple courses': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a custom error
    throw new CustomError(
      500,
      `Batch course creation failed: ${error.message}`
    );
  }
};
