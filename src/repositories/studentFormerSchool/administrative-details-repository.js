// src/repositories/studentFormerSchool/administrative-details-repository.js

import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

// Function to create administrative details
export const createAdministrativeDetails = async (
  formerSchoolId,
  administrativeDetailsData
) => {
  try {
    const administrativeDetailsDataToCreate = {
      ...administrativeDetailsData,
      formerSchool: {
        connect: { id: parseInt(formerSchoolId) },
      },
    };

    // Create the administrative details record
    const administrativeDetails = await prisma.administrativeDetails.create({
      data: administrativeDetailsDataToCreate,
    });

    return administrativeDetails;
  } catch (error) {
    throw error;
  }
};

// Function to update administrative details
export const updateAdministrativeDetails = async (id, updateData) => {
  try {
    // Perform the update operation
    const updatedAdministrativeDetails =
      await prisma.administrativeDetails.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

    return updatedAdministrativeDetails;
  } catch (error) {
    throw error;
  }
};

// Get administrative details by ID
export const getAdministrativeDetailsById = async (id) => {
  try {
    return prisma.administrativeDetails.findUnique({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw error;
  }
};
