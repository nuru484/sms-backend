// src/repositories/userRegistration/teacher-registration-repository.js
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
    const teacherData = {
      digitalSignature,
      spokenLanguages,
      maritalStatus,
      socialMediaHandles,
    };

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

export const updateTeacherPersonalDetails = async ({
  teacherId,
  digitalSignature,
  spokenLanguages,
  socialMediaHandles,
  maritalStatus,
  coursesIds,
  classesIds,
}) => {
  try {
    // Prepare data to be updated
    const teacherDataToUpdate = {
      ...(digitalSignature && { digitalSignature }),
      ...(spokenLanguages && { spokenLanguages }),
      ...(maritalStatus && { maritalStatus }),
      ...(socialMediaHandles && { socialMediaHandles }),
    };

    const connectCourses = coursesIds?.map((id) => ({ id }));
    const connectClasses = classesIds?.map((id) => ({ id }));

    // Update the teacher record in the database using Prisma
    const updatedPersonalDetails = await prisma.teacher.update({
      where: { id: parseInt(teacherId, 10) }, // Specify the teacher to update
      data: {
        ...teacherDataToUpdate,
        // Handle connections for courses and classes if provided
        ...(connectCourses?.length > 0 && {
          courses: {
            connect: connectCourses,
          },
        }),
        ...(connectClasses?.length > 0 && {
          classes: {
            connect: connectClasses,
          },
        }),
      },
    });

    return updatedPersonalDetails; // Return the updated teacher details object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};
