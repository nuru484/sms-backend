// src/repositories/studentFormerSchool/health-support-repository.js

// Importing necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
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

    // Create the health and support record in the database using Prisma
    const healthAndSupportDetails = await prisma.healthAndSupport.create({
      data: healthAndSupportDataToCreate,
    });

    return healthAndSupportDetails; // Return the created health and support details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

// ################################################################################################

// Function to update health and support details
export const updateHealthAndSupportDetails = async (id, updateData) => {
  try {
    // Perform the update operation in the database using Prisma
    const updatedHealthAndSupportDetails = await prisma.healthAndSupport.update(
      {
        where: { id },
        data: updateData,
      }
    );

    return updatedHealthAndSupportDetails; // Return the updated health and support details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
