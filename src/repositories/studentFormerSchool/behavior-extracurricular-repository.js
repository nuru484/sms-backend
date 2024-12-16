// src/repositories/studentFormerSchool/behavior-and-extracurricular-repository

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

// ################################################################################################

// Function to create behavior and extracurricular details
export const createBehaviorAndExtracurricularDetails = async ({
  behaviorRecord,
  disciplinaryActions,
  extracurriculars,
  achievements,
  formerSchoolId, // The ID of the former school to link the record
}) => {
  try {
    // Prepare the data to be stored
    const behaviorAndExtracurricularData = {
      behaviorRecord,
      disciplinaryActions,
      extracurriculars,
      achievements,
    };

    const behaviorAndExtracurricularDataToCreate = {
      ...behaviorAndExtracurricularData,
      formerSchool: {
        connect: { id: formerSchoolId }, // Connect the record to the former school via its ID
      },
    };

    // Log the attempt to create behavior and extracurricular details in the database
    logger.info({
      'Attempting to create behavior and extracurricular details in the database':
        {
          data: behaviorAndExtracurricularDataToCreate,
        },
    });

    // Create the behavior and extracurricular record in the database using Prisma
    const behaviorAndExtracurricularDetails =
      await prisma.behaviorAndExtracurricular.create({
        data: behaviorAndExtracurricularDataToCreate,
      });

    // Log the successful creation of behavior and extracurricular details
    logger.info({
      'Behavior and extracurricular details successfully created in the database.':
        {
          behaviorAndExtracurricularId: behaviorAndExtracurricularDetails.id,
        },
    });

    return behaviorAndExtracurricularDetails; // Return the created record
  } catch (error) {
    // Log any errors encountered during the creation process
    logger.error({
      'Database error during behavior and extracurricular details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate behavior and extracurricular details: ${
          error.meta?.target || error.message
        }`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

// ################################################################################################

// Function to update behavior and extracurricular details
export const updateBehaviorAndExtracurricularDetails = async (
  id,
  updateData
) => {
  try {
    // Log the update attempt
    logger.info({
      'Attempting to update behavior and extracurricular details in the database':
        {
          id,
          updateData,
        },
    });

    // Perform the update operation in the database using Prisma
    const updatedBehaviorAndExtracurricularDetails =
      await prisma.behaviorAndExtracurricular.update({
        where: { id },
        data: updateData,
      });

    // Log the successful update
    logger.info({
      'Behavior and extracurricular details successfully updated in the database':
        {
          behaviorAndExtracurricularId:
            updatedBehaviorAndExtracurricularDetails.id,
        },
    });

    return updatedBehaviorAndExtracurricularDetails; // Return the updated record
  } catch (error) {
    // Log any errors encountered during the update process
    logger.error({
      'Database error during behavior and extracurricular details update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as record not found, and throw appropriate custom errors
    if (error.code === 'P2025') {
      throw new CustomError(
        404,
        `Behavior and extracurricular record with ID ${id} not found.`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
