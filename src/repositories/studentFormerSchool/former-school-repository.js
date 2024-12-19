// src/repositories/studentFormerSchool/former-school-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

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

    // Create the former school record in the database using Prisma
    const formerSchoolDetails = await prisma.formerSchool.create({
      data: formerSchoolDataToCreate,
    });

    return formerSchoolDetails; // Return the created former school details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

// ################################################################################################

export const updateFormerSchoolDetails = async (id, updateData) => {
  try {
    // Perform the update operation in the database using Prisma
    const updatedFormerSchoolDetails = await prisma.formerSchool.update({
      where: { id },
      data: updateData,
    });

    return updatedFormerSchoolDetails; // Return the updated former school details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

// Get former school by ID
export const getFormerSchoolById = async (id) => {
  try {
    return prisma.formerSchool.findUnique({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw error;
  }
};
