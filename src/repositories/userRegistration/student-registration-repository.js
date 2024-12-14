// src/repositories/userRegistration/student-registration-repository.js

// Import necessary modules
import prisma from '../../../prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

/**
 * Repository function to create and associate personal details for a student in the database.
 *
 * @param {Object} studentData - Object containing student personal details like dateOfBirth, ethnicity, admission status, etc.
 * @returns {Promise<Object>} - Returns the created student personal details object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createStudentPersonalDetails = async ({
  ethnicity,
  admissionStatus,
  userId,
}) => {
  try {
    // Prepare data to be stored, including user connection and optional previous school connection.
    const studentData = { ethnicity, admissionStatus };

    const studentDataToCreate = {
      ...studentData,
      user: {
        connect: { id: userId }, // Connect the student to the user via the user ID
      },
    };

    // Log the attempt to create student personal details in the database.
    logger.info({
      'Attempting to create student personal details in the database': {
        data: studentDataToCreate,
      },
    });

    // Create the student record in the database using Prisma
    const personalDetails = await prisma.student.create({
      data: studentDataToCreate,
    });

    // Log the successful creation of student personal details
    logger.info({
      'Student personal details successfully created in the database.': {
        studentId: personalDetails.id,
      },
    });

    return personalDetails; // Return the created student details object
  } catch (error) {
    // Log any errors encountered during the student creation process.
    logger.error({
      'Database error during student personal details creation': {
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

    // Throw a generic internal server error if an unexpected error occurs.
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

/**
 * Repository function to create and associate a parent’s personal details in the database.
 *
 * @param {Object} parentData - Object containing parent’s personal details and relationship to the student.
 * @returns {Promise<Object>} - Returns the created parent object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createParentPersonalDetails = async ({
  relationshipToStudent,
  userId,
  wardsIds,
}) => {
  try {
    // Log the attempt to create the parent and associate it with the user
    logger.info({
      'Attempting to create parent with relationship to student and connect to user in the database':
        {
          relationshipToStudent,
          userId,
        },
    });

    // Create the parent record in the database and link it to the user
    const newParent = await prisma.parent.create({
      data: {
        relationshipToStudent,
        user: {
          connect: { id: userId }, // Connect the parent to the user by user ID
        },
        wards: {
          connect: wardsIds.map((id) => ({ id })), // Connect the parent to his son or ward by the wardId user ID
        },
      },
    });

    // Log the successful creation of the parent and its association with the user
    logger.info({
      'Parent successfully created and connected to the user.': {
        parentId: newParent.id,
        userId: newParent.userId,
      },
    });

    return newParent; // Return the created parent object
  } catch (error) {
    // Log any errors encountered during the creation of the parent
    logger.error({
      'Database error during parent creation and connection to user': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate user details: ${error.meta?.target || error.message}`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};
