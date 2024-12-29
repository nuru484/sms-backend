// src/services/student/student-services.js

import {
  getStudents,
  getStudentById,
} from '../../repositories/users/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { saveToCache, client } from '../../config/redis.js';
import prisma from '../../config/prismaClient.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to fetch all students with pagination and optional search.
 *
 * @param {Object} options - Object containing query parameters like page, limit, and search.
 * @returns {Promise<Object>} - Returns an object containing students and pagination details.
 */
export const getAllStudents = async (options) => {
  try {
    const response = await getStudents(options);

    if (!response || response.students.length === 0) {
      throw new CustomError(404, 'No students found.');
    }

    const studentsCacheKey = `students:${JSON.stringify(options)}`;
    saveToCache(studentsCacheKey, response); // Save the response to the cache

    return response;
  } catch (error) {
    handlePrismaError(error, 'student');
  }
};

/**
 * Service function to fetch a single student by ID.
 *
 * @param {number} studentId - The ID of the student to fetch.
 * @returns {Promise<Object>} - Returns the student object if found.
 * @throws {CustomError} - Throws an error if the student is not found.
 */
export const getStudentByIdService = async (studentId) => {
  try {
    const student = await getStudentById(studentId);

    if (!student) {
      throw new CustomError(404, `Student with ID ${studentId} not found.`);
    }

    const studentCacheKey = `student:${studentId}`;
    saveToCache(studentCacheKey, student); // Save the student to the cache

    return student;
  } catch (error) {
    handlePrismaError(error, 'student');
  }
};

/**
 * Service function to delete a single student by ID.
 *
 * @param {number} studentId - The ID of the student to delete.
 * @returns {Promise<Object>} - Returns the deleted student object.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const removeStudentById = async (studentId) => {
  try {
    const student = await getStudentById(studentId);

    if (!student) {
      throw new CustomError(404, `Student with ID ${studentId} not found.`);
    }

    const studentParents = await prisma.parent.findMany({
      where: {
        wards: {
          some: { id: parseInt(studentId, 10) }, // Match related student
        },
      },
      include: {
        user: true, // Include user details to delete later
      },
    });

    // Collect user IDs for deletion
    const userIds = studentParents.map((parent) => parent.userId);
    if (student.user?.id) {
      userIds.push(student.user.id);
    }

    const response = await prisma.$transaction([
      // Delete student User and Parent Users
      prisma.user.deleteMany({
        where: { id: { in: userIds } },
      }),
    ]);

    const patterns = [`student:${studentId}`, 'students:{*}'];
    await invalidateCache(client, patterns);

    return response;
  } catch (error) {
    handlePrismaError(error, 'student');
  }
};

/**
 * Service function to delete all students.
 *
 * @returns {Promise<Object>} - Returns an object with a message about the deletion count.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */

export const removeAllStudents = async () => {
  try {
    // Retrieve all students and their related parents
    const students = await prisma.student.findMany({
      include: {
        user: true, // Include user details for deletion
        parents: {
          include: {
            user: true, // Include user details of parents
          },
        },
      },
    });

    // Collect all user IDs for students and their parents
    const userIds = [];
    students.forEach((student) => {
      if (student.user?.id) {
        userIds.push(student.user.id);
      }

      student.parents.forEach((parent) => {
        if (parent.user?.id) {
          userIds.push(parent.user.id);
        }
      });
    });

    // Perform the deletions in a transaction
    const response = await prisma.$transaction([
      // Delete all users related to students and parents
      prisma.user.deleteMany({
        where: { id: { in: userIds } },
      }),
    ]);

    // Invalidate cache
    const patterns = [`student:*`, `students:{*}`];
    await invalidateCache(client, patterns);

    return {
      message: `Deleted ${students.length} students and their corresponding parents.`,
    };
  } catch (error) {
    handlePrismaError(error, 'student');
  }
};
