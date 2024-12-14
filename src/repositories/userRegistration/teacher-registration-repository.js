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
  coursesIds,
  classesIds,
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
      courses: {
        connect: coursesIds.map((id) => ({ id })), // Connect the parent to his son or ward by the wardId user ID
      },
      classes: {
        connect: classesIds.map((id) => ({ id })),
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
    throw error;
  }
};
