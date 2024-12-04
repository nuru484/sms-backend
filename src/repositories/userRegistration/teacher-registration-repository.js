// src/repositories/userRegistration/teacher-registration-repository.js

// Import necessary modules
import prisma from '../../../prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

/**
 * Repository function to create and associate personal details for a teacher in the database.
 *
 * @param {Object} teacherData - Object containing teacher personal details like digitalSignature, spokenLanguages, maritalStatus, etc.
 * @returns {Promise<Object>} - Returns the created teacher personal details object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createTeacherPersonalDetails = async ({
  digitalSignature,
  spokenLanguages,
  socialMediaHandles,
  maritalStatus,
  userId,
}) => {
  try {
    // Prepare data to be stored
    const teacherData = { digitalSignature, spokenLanguages, maritalStatus };

    if (socialMediaHandles) {
      teacherData.socialMediaHandles = socialMediaHandles; // Include socialMediaHandles only if provided
    }

    const teacherDataToCreate = {
      ...teacherData,
      user: {
        connect: { id: userId }, // Connect the teacher to the user via the user ID
      },
    };

    // Log the attempt to create teacher personal details in the database
    logger.info({
      'Attempting to create teacher personal details in the database': {
        data: teacherDataToCreate,
      },
    });

    // Create the teacher record in the database using Prisma
    const personalDetails = await prisma.teacher.create({
      data: teacherDataToCreate,
    });

    // Log the successful creation of teacher personal details
    logger.info({
      'Teacher personal details successfully created in the database.': {
        teacherId: personalDetails.id,
      },
    });

    return personalDetails; // Return the created teacher details object
  } catch (error) {
    // Log any errors encountered during the teacher creation process
    logger.error({
      'Database error during teacher personal details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate user details: ${error.meta?.target || error.message}`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

/**
 * Repository function to create and associate a teacher-course relationship in the database.
 *
 * @param {Object} teacherCourseData - Object containing teacher and course IDs.
 * @param {number} teacherId - The ID of the teacher.
 * @param {number} courseId - The ID of the course.
 * @returns {Promise<Object>} - Returns the created teacher-course relation object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createTeacherCourseRelation = async ({ teacherId, courseId }) => {
  try {
    // Log the attempt to create the teacher-course relationship in the database
    logger.info('Attempting to create teacher-course relation in the database');

    // Create the teacher-course relationship using Prisma
    const teacherCourseRelation = await prisma.teacherCourse.create({
      data: {
        teacher: {
          connect: { id: teacherId }, // Connect to the teacher by teacher ID
        },
        course: {
          connect: { id: courseId }, // Connect to the course by course ID
        },
      },
    });

    // Log the successful creation of the teacher-course relation
    logger.info(
      'Teacher-course relation successfully created in the database.'
    );

    return teacherCourseRelation; // Return the created teacher-course relation object
  } catch (error) {
    // Log any errors encountered during the creation of the teacher-course relation
    logger.error({
      'Database error during teacher-course relation creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate teacher-course relationship: ${
          error.meta?.target || error.message
        }`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

/**
 * Repository function to create and associate a teacher-class relationship in the database.
 *
 * @param {Object} teacherClassData - Object containing teacher and class IDs.
 * @param {number} teacherId - The ID of the teacher.
 * @param {number} classId - The ID of the class.
 * @returns {Promise<Object>} - Returns the created teacher-class relation object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createTeacherClassRelation = async ({ teacherId, classId }) => {
  try {
    // Log the attempt to create the teacher-class relationship in the database
    logger.info('Attempting to create teacher-class relation in the database');

    // Create the teacher-class relationship using Prisma
    const teacherClassRelation = await prisma.teacherClass.create({
      data: {
        teacher: {
          connect: { id: teacherId }, // Connect to the teacher by teacher ID
        },
        class: {
          connect: { id: classId }, // Connect to the class by class ID
        },
      },
    });

    // Log the successful creation of the teacher-class relation
    logger.info('Teacher-class relation successfully created in the database.');

    return teacherClassRelation; // Return the created teacher-class relation object
  } catch (error) {
    // Log any errors encountered during the creation of the teacher-class relation
    logger.error({
      'Database error during teacher-class relation creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate teacher-class relationship: ${
          error.meta?.target || error.message
        }`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};
