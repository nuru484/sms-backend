// src/repositories/userRegistration/studentRegistration.js

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
  dateOfBirth,
  ethnicity,
  admissionStatus,
  userId,
  studentPreviousSchoolId,
}) => {
  try {
    // Prepare data to be stored, including user connection and optional previous school connection.
    const studentData = { dateOfBirth, ethnicity, admissionStatus };

    const studentDataToCreate = {
      ...studentData,
      user: {
        connect: { id: userId }, // Connect the student to the user via the user ID
      },
      previousSchool: studentPreviousSchoolId
        ? { connect: { id: studentPreviousSchoolId } } // Optionally connect to a previous school
        : null, // Use null if no previous school ID is provided
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
 * Repository function to create and save the previous school details for a student.
 *
 * @param {Object} schoolDetails - Object containing previous school details such as name and level.
 * @returns {Promise<Object>} - Returns the created previous school details object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createStudentPreviousSchool = async ({
  previousSchoolName,
  previousSchoolLevel,
}) => {
  const studentPreviousSchoolDetails = {
    previousSchoolName,
    previousSchoolLevel,
  };

  try {
    // Log the attempt to create the student previous school details in the database
    logger.info({
      'Attempting to create student previous school details in the database': {
        data: studentPreviousSchoolDetails,
      },
    });

    // Create the student previous school details in the database using Prisma
    const previousSchool = await prisma.studentPreviousSchool.create({
      data: studentPreviousSchoolDetails,
    });

    // Log the successful creation of the previous school details
    logger.info(
      'Student previous school details successfully created in the database.'
    );

    return previousSchool; // Return the created previous school details object
  } catch (error) {
    // Log any errors encountered during the creation of previous school details
    logger.error({
      'Database error during student previous school details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate previous school details: ${
          error.meta?.target || error.message
        }`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

/**
 * Repository function to create and associate a student-parent relationship in the database.
 *
 * @param {Object} relationData - Object containing student ID and parent ID to associate them.
 * @returns {Promise<Object>} - Returns the created student-parent relation object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createStudentParentRelation = async ({ studentId, parentId }) => {
  try {
    // Log the attempt to create the student-parent relationship in the database
    logger.info('Attempting to create student-parent relation in the database');

    // Create the student-parent relationship using Prisma
    const studentParentRelation = await prisma.studentParent.create({
      data: {
        student: {
          connect: { id: studentId }, // Connect to the student by student ID
        },
        parent: {
          connect: { id: parentId }, // Connect to the parent by parent ID
        },
      },
    });

    // Log the successful creation of the student-parent relation
    logger.info(
      'Student-parent relation successfully created in the database.'
    );

    return studentParentRelation; // Return the created student-parent relation object
  } catch (error) {
    // Log any errors encountered during the creation of the student-parent relation
    logger.error({
      'Database error during student-parent relation creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate student-parent relationship: ${
          error.meta?.target || error.message
        }`
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
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};
