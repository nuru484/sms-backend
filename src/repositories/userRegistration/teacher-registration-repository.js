// src/repositories/userRegistration/teacher-registration-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

/**
 * Repository function to create and associate personal details for a teacher in the database.
 *
 * @param {Object} teacherData - Object containing teacher personal details like digitalSignature, spokenLanguages, maritalStatus, etc.
 * @returns {Promise<Object>} - Returns the created teacher personal details object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createTeacherPersonalDetails = async ({
  digitalSignature,
  spokenLanguages,
  socialMediaHandles,
  maritalStatus,
  userId,
  coursesIds,
  classesIds,
}) => {
  try {
    // Prepare data to be stored
    const teacherData = { digitalSignature, spokenLanguages, maritalStatus };

    if (socialMediaHandles) {
      teacherData.socialMediaHandles = socialMediaHandles; // Include socialMediaHandles only if provided
    }

    const teacherDataToCreate = {
      ...teacherData,
      user: {
        connect: { id: parseInt(userId) }, // Connect the teacher to the user via the user ID
      },
      // Only include connections if arrays are non-empty
      ...(coursesIds.length > 0 && {
        courses: {
          connect: coursesIds.map((id) => ({ id })),
        },
      }),
      ...(classesIds.length > 0 && {
        classes: {
          connect: classesIds.map((id) => ({ id })),
        },
      }),
    };

    // Create the teacher record in the database using Prisma
    const personalDetails = await prisma.teacher.create({
      data: teacherDataToCreate,
    });

    return personalDetails; // Return the created teacher details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
