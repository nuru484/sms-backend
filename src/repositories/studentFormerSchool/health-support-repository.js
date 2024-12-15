// src/repositories/studentFormerSchool/health-support-repository.js

// Importing necessary modules
import prisma from '../../../prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

// ################################################################################################

// Function to create health and support details
export const createHealthAndSupportDetails = async ({
  healthRecords,
  specialNeeds,
  formerSchoolId, // The ID of the former school to link the health and support record to
}) => {
  try {
    // Prepare the data to be stored
    const healthAndSupportData = {
      healthRecords,
      specialNeeds,
    };

    const healthAndSupportDataToCreate = {
      ...healthAndSupportData,
      formerSchool: {
        connect: { id: formerSchoolId }, // Connect the health and support record to the former school via its ID
      },
    };

    // Log the attempt to create health and support details in the database
    logger.info({
      'Attempting to create health and support details in the database': {
        data: healthAndSupportDataToCreate,
      },
    });

    // Create the health and support record in the database using Prisma
    const healthAndSupportDetails = await prisma.healthAndSupport.create({
      data: healthAndSupportDataToCreate,
    });

    // Log the successful creation of health and support details
    logger.info({
      'Health and support details successfully created in the database.': {
        healthAndSupportId: healthAndSupportDetails.id,
      },
    });

    return healthAndSupportDetails; // Return the created health and support details object
  } catch (error) {
    // Log any errors encountered during the creation process
    logger.error({
      'Database error during health and support details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate health and support details: ${
          error.meta?.target || error.message
        }`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

// ################################################################################################

// Function to update health and support details
export const updateHealthAndSupportDetails = async (id, updateData) => {
  try {
    // Log the update attempt
    logger.info({
      'Attempting to update health and support details in the database': {
        id,
        updateData,
      },
    });

    // Perform the update operation in the database using Prisma
    const updatedHealthAndSupportDetails = await prisma.healthAndSupport.update(
      {
        where: { id },
        data: updateData,
      }
    );

    // Log the successful update
    logger.info({
      'Health and support details successfully updated in the database': {
        healthAndSupportId: updatedHealthAndSupportDetails.id,
      },
    });

    return updatedHealthAndSupportDetails; // Return the updated health and support details object
  } catch (error) {
    // Log any errors encountered during the update process
    logger.error({
      'Database error during health and support details update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as record not found, and throw appropriate custom errors
    if (error.code === 'P2025') {
      throw new CustomError(
        404,
        `Health and support record with ID ${id} not found.`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
