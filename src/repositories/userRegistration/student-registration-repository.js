// src/repositories/userRegistration/student-registration-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

/**
 * Repository function to create and associate personal details for a student in the database.
 */
export const createStudentPersonalDetails = async (
  userId,
  studentApplicationNumberId,
  studentData
) => {
  try {
    const studentDataToCreate = {
      ...studentData,
      user: {
        connect: { id: parseInt(userId) }, // Connect the student to the user via the user ID
      },

      StudentApplicationNumber: {
        connect: { id: parseInt(studentApplicationNumberId) }, // Connect the student to the user via the user ID
      },
    };

    // Create the student record in the database using Prisma
    const personalDetails = await prisma.student.create({
      data: studentDataToCreate,
    });

    return personalDetails; // Return the created student details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

/**
 * Repository function to create and associate a parent’s personal details in the database.
 *
 * @param {Object} parentData - Object containing parent’s personal details and relationship to the student.
 * @returns {Promise<Object>} - Returns the created parent object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createParentPersonalDetails = async ({
  relationshipToStudent,
  userId,
  wardsIds,
}) => {
  try {
    // Create the parent record in the database and link it to the user
    const newParent = await prisma.parent.create({
      data: {
        relationshipToStudent,
        user: {
          connect: { id: userId }, // Connect the parent to the user by user ID
        },
        wards: {
          connect: wardsIds.map((id) => ({ id })), // Connect the parent to his son or ward by the wardId user ID
        },
      },
    });

    return newParent; // Return the created parent object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

/**
 * Repository function to update a student's personal details in the database.
 *
 * @param {Object} studentData - Object containing updated student details like ethnicity, admission status, etc.
 * @param {string} studentId - ID of the student to update.
 * @returns {Promise<Object>} - Returns the updated student details object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the update process or database interaction.
 */
export const updateStudentPersonalDetails = async (studentId, studentData) => {
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(studentId) },
      data: studentData,
    });

    return updatedStudent;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

/**
 * Repository function to update a parent’s personal details in the database.
 *
 * @param {Object} parentData - Object containing updated parent details and relationship to the student.
 * @param {string} parentId - ID of the parent to update.
 * @returns {Promise<Object>} - Returns the updated parent object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the update process or database interaction.
 */
export const updateParentPersonalDetails = async (
  parentId,
  updateData,
  wardsIds
) => {
  try {
    // Prepare the data object
    const data = {
      ...updateData, // Spread only valid fields from updateData
      ...(wardsIds && {
        // Only include wards if wardsIds is provided
        wards: {
          connect: wardsIds.map((id) => ({ id: parseInt(id) })), // Connect the parent
        },
      }),
    };

    // Update the parent record
    const updatedParent = await prisma.parent.update({
      where: { id: parseInt(parentId) },
      data,
    });

    return updatedParent;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
