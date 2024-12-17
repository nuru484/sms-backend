// src/repositories/userRegistration/student-registration-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

/**
 * Repository function to create and associate personal details for a student in the database.
 *
 * @param {Object} studentData - Object containing student personal details like dateOfBirth, ethnicity, admission status, etc.
 * @returns {Promise<Object>} - Returns the created student personal details object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createStudentPersonalDetails = async ({
  ethnicity,
  admissionStatus,
  userId,
}) => {
  try {
    // Prepare data to be stored, including user connection and optional previous school connection.
    const studentData = { ethnicity, admissionStatus };

    const studentDataToCreate = {
      ...studentData,
      user: {
        connect: { id: userId }, // Connect the student to the user via the user ID
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
export const updateStudentPersonalDetails = async (studentData, studentId) => {
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
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
export const updateParentPersonalDetails = async (parentData, parentId) => {
  try {
    const updatedParent = await prisma.parent.update({
      where: { id: parentId },
      data: parentData,
    });

    return updatedParent;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};
