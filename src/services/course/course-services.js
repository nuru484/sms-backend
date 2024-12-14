// src/services/course/course-creation-service.js

import {
  createCourse,
  updateCourseById,
  fetchCourseById,
  fetchCourses,
  deleteCourseById,
  deleteAllCourses,
} from '../../repositories/course/course-repository.js';
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

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
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

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

/**
 * Service function to update a course by its ID.
 *
 * @param {number} id - The ID of the course to update.
 * @param {Object} updateData - Object containing the fields to update (e.g., { name: 'New Name', code: 'NEW123' }).
 * @returns {Promise<Object>} - Returns the updated course object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const updateCourse = async (id, updateData) => {
  try {
    // Log the course update attempt
    logger.info({
      'Attempting to update course': {
        courseId: id,
        updateData,
      },
    });

    // Call the repository to update the course
    const updatedCourse = await updateCourseById(id, updateData);

    // Log the successful update
    logger.info({
      'Course updated successfully': {
        courseId: updatedCourse.id,
        updatedFields: updateData,
      },
    });

    return updatedCourse;
  } catch (error) {
    // Log the error
    logger.error({
      'Error updating course': {
        courseId: id,
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

/**
 * Service function to fetch a single course by its ID.
 *
 * @param {number} id - The ID of the course to fetch.
 * @returns {Promise<Object>} - Returns the course object.
 */
export const getCourseById = async (id) => {
  return await fetchCourseById(id);
};

/**
 * Service function to fetch all courses with pagination and search.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns the courses and pagination info.
 */
export const getCourses = async (query) => {
  return await fetchCourses(query);
};

/**
 * Service function to delete a single course by its ID.
 *
 * @param {number} id - The ID of the course to delete.
 * @returns {Promise<Object>} - Returns the deleted course object.
 */
export const removeCourseById = async (id) => {
  return await deleteCourseById(id);
};

/**
 * Service function to delete all courses.
 *
 * @returns {Promise<number>} - Returns the count of deleted courses.
 */
export const removeAllCourses = async () => {
  return await deleteAllCourses();
};
