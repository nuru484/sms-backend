// src/services/course/course-creation-service.js
import {
  createCourse,
  updateCourseById,
  fetchCourseById,
  fetchCourses,
  deleteCourseById,
  deleteAllCourses,
} from '../../repositories/course/course-repository.js';
import prisma from '../../config/prismaClient.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to create a single course.
 *
 * @param {Object} courseData - Object containing course details like name and code.
 * @returns {Promise<Object>} - Returns the created course object.
 * @throws {CustomError} - Throws an error if course creation fails.
 */
export const createSingleCourse = async (courseData) => {
  try {
    // Call the repository to create the course
    const course = await createCourse(courseData);

    // Invalidate the cache for all courses
    const patterns = ['courses:{*}'];
    await invalidateCache(client, patterns);

    return course;
  } catch (error) {
    handlePrismaError(error, 'Course');
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
    const coursePromises = courses.map((course) => {
      return prisma.course.create({
        data: course,
      });
    });

    // Use $transaction to run all Prisma Client promises in a transaction
    const createdCourses = await prisma.$transaction(coursePromises);

    // Invalidate the cache for all courses
    const patterns = ['courses:{*}'];
    await invalidateCache(client, patterns);

    return createdCourses;
  } catch (error) {
    handlePrismaError(error, 'Course');
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
export const updateCourse = async (courseId, updateData) => {
  try {
    // Call the repository to update the course
    const updatedCourse = await updateCourseById(courseId, updateData);

    // Invalidate the cache for all courses
    const patterns = [`course:${courseId}`, 'courses:{*}'];
    await invalidateCache(client, patterns);

    return updatedCourse;
  } catch (error) {
    handlePrismaError(error, 'Course');
  }
};

/**
 * Service function to fetch a single course by its ID.
 *
 * @param {number} courseId - The ID of the course to fetch.
 * @returns {Promise<Object>} - Returns the course object.
 */
export const getCourseById = async (courseId) => {
  try {
    const course = await fetchCourseById(courseId);

    if (!course) {
      throw new CustomError(404, `Course with ID of ${courseId} not found.`);
    }

    // Cache the course data
    const courseCacheKey = `course:${courseId}`;
    saveToCache(courseCacheKey, course);

    return course;
  } catch (error) {
    handlePrismaError(error, 'Course');
  }
};

/**
 * Service function to fetch all courses with pagination and search.
 */
export const getCourses = async (options) => {
  try {
    const response = await fetchCourses(options);

    if (!response || response.courses.length === 0) {
      throw new CustomError(404, `There are currently no courses available.`);
    }

    // Cache the courses data
    const coursesCacheKey = `courses:${JSON.stringify(options)}`;
    saveToCache(coursesCacheKey, response);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Course');
  }
};

/**
 * Service function to delete a single course by its ID.
 *
 * @param {number} courseId - The ID of the course to delete.
 * @returns {Promise<Object>} - Returns the deleted course object.
 */
export const removeCourseById = async (courseId) => {
  try {
    // Invalidate the cache for all courses
    const patterns = [`course:${courseId}`, 'courses:{*}'];
    await invalidateCache(client, patterns);

    return await deleteCourseById(courseId);
  } catch (error) {
    handlePrismaError(error, 'Course');
  }
};

/**
 * Service function to delete all courses.
 *
 * @returns {Promise<number>} - Returns the count of deleted courses.
 */
export const removeAllCourses = async () => {
  try {
    const response = await deleteAllCourses();

    if (!response || response === 0) {
      throw new CustomError(
        404,
        `There are currently no courses available to delete.`
      );
    }

    // Invalidate the cache for all courses
    const patterns = [`course:*`, 'courses:{*}'];
    await invalidateCache(client, patterns);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Course');
  }
};
