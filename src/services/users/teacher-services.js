// src/services/teacher/teacher-services.js
import {
  getTeachers,
  getTeacherById,
} from '../../repositories/users/teacher-repository.js';
import { deleteUserById } from '../../repositories/users/general-user-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { saveToCache, client } from '../../config/redis.js';
import prisma from '../../config/prismaClient.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to fetch all teachers with pagination and optional search.
 *
 * @param {Object} options - Object containing query parameters like page, limit, and search.
 * @returns {Promise<Object>} - Returns an object containing teachers and pagination details.
 */
export const getAllTeachers = async (options) => {
  try {
    const response = await getTeachers(options);

    if (!response || response.teachers.length === 0) {
      throw new CustomError(404, 'No teachers found.');
    }

    const teachersCacheKey = `teachers:${JSON.stringify(options)}`;
    saveToCache(teachersCacheKey, response); // Save the response to the cache

    return response;
  } catch (error) {
    handlePrismaError(error, 'teacher');
  }
};

/**
 * Service function to fetch a single teacher by ID.
 *
 * @param {number} teacherId - The ID of the teacher to fetch.
 * @returns {Promise<Object>} - Returns the teacher object if found.
 * @throws {CustomError} - Throws an error if the teacher is not found.
 */
export const getSingleTeacherById = async (teacherId) => {
  try {
    const teacher = await getTeacherById(teacherId);

    if (!teacher) {
      throw new CustomError(404, `Teacher with ID ${teacherId} not found.`);
    }

    const teacherCacheKey = `teacher:${teacherId}`;
    saveToCache(teacherCacheKey, { teacher }); // Save the teacher to the cache

    return teacher;
  } catch (error) {
    handlePrismaError(error, 'teacher');
  }
};

/**
 * Service function to delete a single teacher by ID.
 *
 * @param {number} teacherId - The ID of the teacher to delete.
 * @returns {Promise<Object>} - Returns the deleted teacher object.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const removeTeacherById = async (teacherId) => {
  try {
    const teacher = await getTeacherById(teacherId);

    if (!teacher) {
      throw new CustomError(404, `Teacher with ID ${teacherId} not found.`);
    }

    // Collect user ID for deletion
    const userId = teacher.user?.id;

    const response = await deleteUserById(userId);

    const patterns = [`teacher:${teacherId}`, 'teachers:{*}'];
    await invalidateCache(client, patterns);

    return response;
  } catch (error) {
    handlePrismaError(error, 'teacher');
  }
};

/**
 * Service function to delete all teachers.
 *
 * @returns {Promise<Object>} - Returns an object with a message about the deletion count.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const removeAllTeachers = async () => {
  try {
    // Retrieve all teachers and their related users
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true, // Include user details for deletion
      },
    });

    // Collect all user IDs for teachers
    const userIds = teachers
      .map((teacher) => teacher.user?.id)
      .filter((id) => id);

    // Perform the deletions in a transaction
    const response = await prisma.$transaction([
      // Delete all users related to teachers
      prisma.user.deleteMany({
        where: { id: { in: userIds } },
      }),
    ]);

    // Invalidate cache
    const patterns = [`teacher:*`, `teachers:{*}`];
    await invalidateCache(client, patterns);

    return {
      message: `Deleted ${teachers.length} teachers.`,
    };
  } catch (error) {
    handlePrismaError(error, 'teacher');
  }
};
