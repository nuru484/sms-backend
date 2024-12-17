// src/repositories/course/course-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js';

/**
 * Repository function to create a single course in the database.
 *
 * @param {Object} courseData - Object containing course details like name and code.
 * @returns {Promise<Object>} - Returns the created course object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createCourse = async ({ name, code }) => {
  try {
    // Create the course record in the database using Prisma
    const course = await prisma.course.create({
      data: { name, code },
    });

    return course; // Return the created course object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
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
    // Attempt to update the course in the database
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    return updatedCourse; // Return the updated course object
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single course by its ID.
 *
 * @param {number} id - The ID of the course to fetch.
 * @returns {Promise<Object>} - Returns the course object if found.
 * @throws {CustomError} - Throws a custom error if the course is not found or there's a database error.
 */
export const fetchCourseById = async (id) => {
  try {
    // Fetch the course by ID
    const course = await prisma.course.findUnique({
      where: { id },
    });

    return course;
  } catch (error) {
    // Re-throw the error to be handled by the error handler middleware
    throw error;
  }
};

/**
 * Repository function to fetch courses with pagination and optional search by name.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns an object containing the courses and pagination info.
 */
export const fetchCourses = async ({ page = 1, limit = 10, search = '' }) => {
  try {
    const skip = (page - 1) * limit;

    // Fetch the total number of courses
    const total = await prisma.course.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });

    // Fetch the courses with pagination and search
    const courses = await prisma.course.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
    });

    return {
      courses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete a single course by ID.
 *
 * @param {number} id - The ID of the course to delete.
 * @returns {Promise<Object>} - Returns the deleted course object.
 */
export const deleteCourseById = async (id) => {
  try {
    const course = await prisma.course.delete({
      where: { id },
    });

    return course;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all courses.
 *
 * @returns {Promise<number>} - Returns the count of deleted courses.
 */
export const deleteAllCourses = async () => {
  try {
    const deletedCount = await prisma.course.deleteMany();

    return deletedCount.count;
  } catch (error) {
    throw error;
  }
};
