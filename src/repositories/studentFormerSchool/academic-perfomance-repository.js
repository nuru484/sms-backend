// src/repositories/studentFormerSchool/academic-perfomance-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

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

    // Create the academic performance record in the database using Prisma
    const academicPerformanceDetails = await prisma.academicPerformance.create({
      data: academicPerformanceDataToCreate,
    });

    return academicPerformanceDetails; // Return the created academic performance details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

// ################################################################################################

// Function to update academic performance details
export const updateAcademicPerformanceDetails = async (id, updateData) => {
  try {
    // Perform the update operation in the database using Prisma
    const updatedAcademicPerformanceDetails =
      await prisma.academicPerformance.update({
        where: { id },
        data: updateData,
      });

    return updatedAcademicPerformanceDetails; // Return the updated academic performance details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
