// src/repositories/studentFormerSchool/academic-perfomance-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

// ################################################################################################

// Function to create academic performance details
export const createAcademicPerformanceDetails = async ({
  previousGrade,
  promotionStatus,
  courses,
  grades,
  classRanking,
  specialPrograms,
  formerSchoolId, // The ID of the former school to link the academic performance record to
}) => {
  try {
    // Prepare the data to be stored
    const academicPerformanceData = {
      previousGrade,
      promotionStatus,
      courses,
      grades,
      classRanking,
      specialPrograms,
    };

    const academicPerformanceDataToCreate = {
      ...academicPerformanceData,
      formerSchool: {
        connect: { id: formerSchoolId }, // Connect the academic performance record to the former school via its ID
      },
    };

    // Log the attempt to create academic performance details in the database
    logger.info({
      'Attempting to create academic performance details in the database': {
        data: academicPerformanceDataToCreate,
      },
    });

    // Create the academic performance record in the database using Prisma
    const academicPerformanceDetails = await prisma.academicPerformance.create({
      data: academicPerformanceDataToCreate,
    });

    // Log the successful creation of academic performance details
    logger.info({
      'Academic performance details successfully created in the database.': {
        academicPerformanceId: academicPerformanceDetails.id,
      },
    });

    return academicPerformanceDetails; // Return the created academic performance details object
  } catch (error) {
    // Log any errors encountered during the creation process
    logger.error({
      'Database error during academic performance details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate academic performance details: ${
          error.meta?.target || error.message
        }`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

// ################################################################################################

// Function to update academic performance details
export const updateAcademicPerformanceDetails = async (id, updateData) => {
  try {
    // Log the update attempt
    logger.info({
      'Attempting to update academic performance details in the database': {
        id,
        updateData,
      },
    });

    // Perform the update operation in the database using Prisma
    const updatedAcademicPerformanceDetails =
      await prisma.academicPerformance.update({
        where: { id },
        data: updateData,
      });

    // Log the successful update
    logger.info({
      'Academic performance details successfully updated in the database': {
        academicPerformanceId: updatedAcademicPerformanceDetails.id,
      },
    });

    return updatedAcademicPerformanceDetails; // Return the updated academic performance details object
  } catch (error) {
    // Log any errors encountered during the update process
    logger.error({
      'Database error during academic performance details update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as record not found, and throw appropriate custom errors
    if (error.code === 'P2025') {
      throw new CustomError(
        404,
        `Academic performance record with ID ${id} not found.`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
