// src/repositories/userRegistration/teacher-registration-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

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

    // Ensure coursesIds and classesIds are valid arrays (default to empty arrays if undefined)
    const validCoursesIds = Array.isArray(coursesIds) ? coursesIds : [];
    const validClassesIds = Array.isArray(classesIds) ? classesIds : [];

    const teacherDataToCreate = {
      ...teacherData,
      user: {
        connect: { id: parseInt(userId) }, // Connect the teacher to the user via the user ID
      },
      // Only include connections if arrays are non-empty
      ...(validCoursesIds.length > 0 && {
        courses: {
          connect: validCoursesIds.map((id) => ({ id })),
        },
      }),
      ...(validClassesIds.length > 0 && {
        classes: {
          connect: validClassesIds.map((id) => ({ id })),
        },
      }),
    };

    // Log the attempt to create teacher personal details in the database
    logger.info({
      'Attempting to create teacher personal details in the database': {
        data: teacherDataToCreate,
      },
    });

    // Create the teacher record in the database using Prisma
    const personalDetails = await prisma.teacher.create({
      data: teacherDataToCreate,
    });

    // Log the successful creation of teacher personal details
    logger.info({
      'Teacher personal details successfully created in the database.': {
        teacherId: personalDetails.id,
      },
    });

    return personalDetails; // Return the created teacher details object
  } catch (error) {
    // Log any errors encountered during the teacher creation process
    logger.error({
      'Database error during teacher personal details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
