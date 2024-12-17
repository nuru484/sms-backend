// src/repositories/studentFormerSchool/behavior-and-extracurricular-repository

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

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

    // Create the behavior and extracurricular record in the database using Prisma
    const behaviorAndExtracurricularDetails =
      await prisma.behaviorAndExtracurricular.create({
        data: behaviorAndExtracurricularDataToCreate,
      });

    return behaviorAndExtracurricularDetails; // Return the created record
  } catch (error) {
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
    // Perform the update operation in the database using Prisma
    const updatedBehaviorAndExtracurricularDetails =
      await prisma.behaviorAndExtracurricular.update({
        where: { id },
        data: updateData,
      });

    return updatedBehaviorAndExtracurricularDetails; // Return the updated record
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
