// src/repositories/course/course-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

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
 * @param {number} courseId - The ID of the course to be updated.
 * @param {Object} updateData - The data to update (e.g., { name: 'New Name', code: 'NEW123' }).
 * @returns {Promise<Object>} - Returns the updated course object if successful.
 * @throws {CustomError} - Throws a custom error if the course is not found or if there is a database error.
 */
export const updateCourseById = async (courseId, updateData) => {
  try {
    // Attempt to update the course in the database
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(courseId, 10) },
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
 * @param {number} courseId - The ID of the course to fetch.
 * @returns {Promise<Object>} - Returns the course object if found.
 * @throws {CustomError} - Throws a custom error if the course is not found or there's a database error.
 */
export const fetchCourseById = async (courseId) => {
  try {
    // Fetch the course by ID
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId, 10) },
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
export const fetchCourses = async (options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    // Prepare search filters
    const searchFilters = {
      ...(searchQuery && {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            code: {
              contains: searchQuery,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        ],
      }),
    };

    // Fetch total count of courses matching the filters
    const total = await prisma.course.count({
      where: searchFilters,
    });

    let courses;
    if (fetchAll) {
      // Fetch all courses without pagination
      courses = await prisma.course.findMany({
        where: searchFilters,
        orderBy: {
          name: 'asc', // Optional: order courses alphabetically by name
        },
      });
    } else {
      // Fetch paginated courses
      courses = await prisma.course.findMany({
        where: searchFilters,
        skip,
        take: limit,
        orderBy: {
          name: 'asc', // Optional: order courses alphabetically by name
        },
      });
    }

    return {
      courses,
      pagination: fetchAll
        ? null // No pagination info if fetching all courses
        : {
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
export const deleteCourseById = async (courseId) => {
  try {
    const course = await prisma.course.delete({
      where: { id: parseInt(courseId, 10) },
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
