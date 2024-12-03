// src/repositories/userRegistration/studentRegistration.js
import prisma from '../../../prismaClient.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

export const createStudentPersonalDetails = async ({
  dateOfBirth,
  ethnicity,
  admissionStatus,
  userId,
  studentPreviousSchoolId,
}) => {
  try {
    const studentData = { dateOfBirth, ethnicity, admissionStatus };

    // Prepare data for Prisma create, including connecting to user and optionally previous school
    const studentDataToCreate = {
      ...studentData,
      user: {
        connect: { id: userId }, // Connect the user to the student
      },
      previousSchool: studentPreviousSchoolId
        ? { connect: { id: studentPreviousSchoolId } }
        : null, // Use null instead of undefined
    };

    logger.info({
      'Attempting to create student personal details in the database': {
        data: studentDataToCreate,
      },
    });

    // Create the student record in the database
    const personalDetails = await prisma.student.create({
      data: studentDataToCreate,
    });

    logger.info({
      'Student personal details successfully created in the database.': {
        studentId: personalDetails.id,
      },
    });

    return personalDetails;
  } catch (error) {
    logger.error({
      'Database error during student personal details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate user details: ${error.meta?.target || error.message}`
      );
    }

    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

export const createStudentPreviousSchool = async ({
  previousSchoolName,
  previousSchoolLevel,
}) => {
  const studentPreviousSchoolDetails = {
    previousSchoolName,
    previousSchoolLevel,
  };

  try {
    logger.info({
      'Attempting to create student previous school details in the database': {
        data: studentPreviousSchoolDetails,
      },
    });

    const previousSchool = await prisma.studentPreviousSchool.create({
      data: studentPreviousSchoolDetails,
    });

    logger.info(
      'Student previous school details successfully created in the database.'
    );

    return previousSchool;
  } catch (error) {
    logger.error({
      'Database error during student previous school details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate previous school details: ${
          error.meta?.target || error.message
        }`
      );
    }

    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

export const createStudentParentRelation = async ({ studentId, parentId }) => {
  try {
    logger.info('Attempting to create student-parent relation in the database');

    // Create the student-parent relationship using connect
    const studentParentRelation = await prisma.studentParent.create({
      data: {
        student: {
          connect: { id: studentId }, // Connect to the student
        },
        parent: {
          connect: { id: parentId }, // Connect to the parent
        },
      },
    });

    logger.info(
      'Student-parent relation successfully created in the database.'
    );

    return studentParentRelation;
  } catch (error) {
    logger.error({
      'Database error during student-parent relation creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate student-parent relationship: ${
          error.meta?.target || error.message
        }`
      );
    }

    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

export const createParentPersonalDetails = async ({
  relationshipToStudent,
  userId,
}) => {
  try {
    logger.info({
      'Attempting to create parent with relationship to student and connect to user in the database':
        {
          relationshipToStudent,
          userId,
        },
    });

    // Create the parent and connect it to the user
    const newParent = await prisma.parent.create({
      data: {
        relationshipToStudent,
        user: {
          connect: { id: userId }, // Connect the parent to the user
        },
      },
    });

    logger.info({
      'Parent successfully created and connected to the user.': {
        parentId: newParent.id,
        userId: newParent.userId,
      },
    });

    return newParent;
  } catch (error) {
    logger.error({
      'Database error during parent creation and connection to user': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle potential errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate user details: ${error.meta?.target || error.message}`
      );
    }

    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};
