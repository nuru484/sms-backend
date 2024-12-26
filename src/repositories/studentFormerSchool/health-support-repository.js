// src/repositories/studentFormerSchool/health-support-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

// Function to create health and support details
export const createHealthAndSupportDetails = async (
  formerSchoolId,
  healthAndSupportData
) => {
  try {
    const healthAndSupportDataToCreate = {
      ...healthAndSupportData,
      formerSchool: {
        connect: { id: parseInt(formerSchoolId) }, // Connect the health and support record to the former school via its ID
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

// Function to update health and support details
export const updateHealthAndSupportDetails = async (id, updateData) => {
  try {
    // Perform the update operation in the database using Prisma
    const updatedHealthAndSupportDetails = await prisma.healthAndSupport.update(
      {
        where: { id: parseInt(id) },
        data: updateData,
      }
    );

    return updatedHealthAndSupportDetails; // Return the updated health and support details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
