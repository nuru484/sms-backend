// src/repositories/studentFormerSchool/former-school-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

export const createFormerSchoolDetails = async ({
  name,
  address,
  contactNumber,
  email,
  schoolType,
  startDate,
  endDate,
  reasonForLeaving,
  studentId,
}) => {
  try {
    // Prepare data to be stored, including student connection
    const formerSchoolData = {
      name,
      address,
      contactNumber,
      email,
      schoolType,
      startDate,
      endDate,
      reasonForLeaving,
    };

    const formerSchoolDataToCreate = {
      ...formerSchoolData,
      student: {
        connect: { id: studentId }, // Connect the former school to the student via the student ID
      },
    };

    // Log the attempt to create former school details in the database.
    logger.info({
      'Attempting to create former school details in the database': {
        data: formerSchoolDataToCreate,
      },
    });

    // Create the former school record in the database using Prisma
    const formerSchoolDetails = await prisma.formerSchool.create({
      data: formerSchoolDataToCreate,
    });

    // Log the successful creation of former school details
    logger.info({
      'Former school details successfully created in the database.': {
        formerSchoolId: formerSchoolDetails.id,
      },
    });

    return formerSchoolDetails; // Return the created former school details object
  } catch (error) {
    // Log any errors encountered during the creation process.
    logger.error({
      'Database error during former school details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate former school details: ${
          error.meta?.target || error.message
        }`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

// ################################################################################################

export const updateFormerSchoolDetails = async (id, updateData) => {
  try {
    // Log the update attempt
    logger.info({
      'Attempting to update former school details in the database': {
        id,
        updateData,
      },
    });

    // Perform the update operation in the database using Prisma
    const updatedFormerSchoolDetails = await prisma.formerSchool.update({
      where: { id },
      data: updateData,
    });

    // Log the successful update
    logger.info({
      'Former school details successfully updated in the database': {
        formerSchoolId: updatedFormerSchoolDetails.id,
      },
    });

    return updatedFormerSchoolDetails; // Return the updated former school details object
  } catch (error) {
    // Log any errors encountered during the update process
    logger.error({
      'Database error during former school details update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as record not found, and throw appropriate custom errors
    if (error.code === 'P2025') {
      throw new CustomError(
        404,
        `Former school record with ID ${id} not found.`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};
