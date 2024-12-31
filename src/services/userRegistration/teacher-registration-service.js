// src/services/userRegistration/teacher-registration-service.js
import {
  createUserBasicDetails,
  updateUserBasicDetails,
} from '../../repositories/userRegistration/general-user-registration-repository.js';
import {
  createTeacherPersonalDetails,
  updateTeacherPersonalDetails,
} from '../../repositories/userRegistration/teacher-registration-repository.js';
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from '../../config/claudinary.js';
import { getTeacherById } from '../../repositories/users/teacher-repository.js';
import { createUserAddress } from '../address/address-services.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import prisma from '../../config/prismaClient.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { checkUniquenessOnUpdate } from '../../utils/helpers/validation-helpers.js';

/**
 * Main function to process teacher registration.
 *
 * @param {Object} payload - The payload containing teacher registration details.
 * @returns {Promise<Object>} - Returns a success message if registration is successful.
 * @throws {CustomError} - Throws an error if any step in the process fails.
 */
export const processTeacherRegistration = async (payload, payloadFiles) => {
  const {
    firstName,
    middleName,
    lastName,
    username,
    password,
    role,
    gender,
    email,
    phoneNumber,
    employmentType,
    dateOfBirth,
    spokenLanguages,
    socialMediaHandles,
    maritalStatus,
    city,
    country,
    region,
    postalCode,
    digitalAddress,
    coursesIds,
    classesIds,
  } = payload;

  // Step 1: Validate if courses and classes exist (early validation)
  const validCoursesIds = Array.isArray(coursesIds)
    ? coursesIds.map(Number)
    : [];
  const validClassesIds = Array.isArray(classesIds)
    ? classesIds.map(Number)
    : [];

  try {
    // Check if all course IDs are valid
    if (validCoursesIds.length > 0) {
      const courses = await prisma.course.findMany({
        where: {
          id: { in: validCoursesIds },
        },
      });
      const validCourseIds = courses.map((course) => course.id);
      const invalidCourseIds = validCoursesIds.filter(
        (id) => !validCourseIds.includes(id)
      );
      if (invalidCourseIds.length > 0) {
        throw new CustomError(
          404,
          `Courses with IDs ${invalidCourseIds.join(', ')} not found.`
        );
      }
    }

    // Check if all class IDs are valid
    if (validClassesIds.length > 0) {
      console.log('Valid class ids: ' + validClassesIds);
      const classes = await prisma.class.findMany({
        where: {
          id: { in: validClassesIds },
        },
      });
      const validClassIds = classes.map((cls) => cls.id);
      const invalidClassIds = validClassesIds.filter(
        (id) => !validClassIds.includes(id)
      );
      if (invalidClassIds.length > 0) {
        throw new CustomError(
          404,
          `Classes with IDs ${invalidClassIds.join(', ')} not found.`
        );
      }
    }

    const { profilePhoto, digitalSignature } = payloadFiles;

    const teacherProfilePhotoUrl =
      profilePhoto && (await uploadFileToCloudinary(profilePhoto[0]));

    const teacherDigitalSignatureUrl =
      digitalSignature && (await uploadFileToCloudinary(digitalSignature[0]));

    const teacher = await createUserBasicDetails({
      firstName,
      middleName,
      lastName,
      username,
      password,
      role,
      gender,
      profilePhoto: teacherProfilePhotoUrl,
      email,
      phoneNumber,
      employmentType,
      dateOfBirth,
    });

    logger.info('Teacher basic details successfully created');

    // Step 3: Create Teacher Personal Details

    const teacherPersonalDetails = await createTeacherPersonalDetails({
      digitalSignature: teacherDigitalSignatureUrl,
      spokenLanguages,
      socialMediaHandles,
      maritalStatus,
      userId: teacher.id,
      coursesIds: validCoursesIds.length > 0 ? validCoursesIds : [],
      classesIds: validClassesIds.length > 0 ? validClassesIds : [],
    });

    logger.info('Teacher personal details successfully created.');

    // Step 4: Create Teacher Address
    const teacherAddress = await createUserAddress({
      city,
      country,
      region,
      postalCode,
      digitalAddress,
      userId: teacher.id,
    });

    logger.info('Teacher address successfully created.');

    // Invalidate cache
    const patterns = ['teachers:{*}'];
    await invalidateCache(client, patterns);

    return {
      teacher: { ...teacher, teacherPersonalDetails },
    };
  } catch (error) {
    handlePrismaError(error, 'Teacher Registration');
  }
};

export const processUpdateTeacherDetails = async (
  teacherId,
  payload,
  payloadFiles
) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      username,
      role,
      email,
      phoneNumber,
      employmentType,
      dateOfBirth,
      spokenLanguages,
      socialMediaHandles,
      maritalStatus,
      coursesIds,
      classesIds,
    } = payload;

    const teacher = await getTeacherById(teacherId);
    if (!teacher) {
      throw new CustomError(400, `Teacher with ID ${teacherId} not found!`);
    }

    await checkUniquenessOnUpdate('user', 'email', email, teacher.user.id);
    await checkUniquenessOnUpdate(
      'user',
      'username',
      username,
      teacher.user.id
    );

    // Validate and process courses and classes
    if (coursesIds && Array.isArray(coursesIds)) {
      const courseValidationPromises = coursesIds.map(async (courseId) => {
        const course = await prisma.course.findUnique({
          where: { id: parseInt(courseId) },
        });

        if (!course) {
          throw new CustomError(404, `Course with ID ${courseId} not found.`);
        }
      });

      await Promise.all(courseValidationPromises);
    }

    if (classesIds && Array.isArray(classesIds)) {
      const classValidationPromises = classesIds.map(async (classId) => {
        const cls = await prisma.class.findUnique({
          where: { id: parseInt(classId) },
        });

        if (!cls) {
          throw new CustomError(404, `Class with ID ${classId} not found.`);
        }
      });

      await Promise.all(classValidationPromises);
    }

    const { profilePhoto, digitalSignature } = payloadFiles;

    const profilePhotoUrl =
      profilePhoto && (await uploadFileToCloudinary(profilePhoto[0]));

    const digitalSignatureUrl =
      digitalSignature && (await uploadFileToCloudinary(digitalSignature[0]));

    if (teacher.user.profilePhoto) {
      await deleteFileFromCloudinary(teacher.user.profilePhoto);
    }
    if (teacher.user.digitalSignature) {
      await deleteFileFromCloudinary(teacher.user.digitalSignature);
    }

    // Update basic details
    const updatedTeacher = await updateUserBasicDetails(teacher.user.id, {
      firstName,
      middleName,
      lastName,
      profilePhoto: profilePhotoUrl,
      gender,
      username,
      role,
      email,
      phoneNumber,
      employmentType,
      dateOfBirth,
    });

    logger.info(`Teacher basic details updated successfully.`);

    // Update personal details
    const teacherPersonalDetails = await updateTeacherPersonalDetails({
      teacherId: teacher.id,
      spokenLanguages,
      socialMediaHandles,
      digitalSignature: digitalSignatureUrl,
      maritalStatus,
      coursesIds: coursesIds && coursesIds.map(Number),
      classesIds: classesIds && classesIds.map(Number),
    });

    logger.info(`Teacher personal details updated successfully.`);

    // Invalidate cache
    const patterns = ['teachers:{*}', `teacher:${teacherId}`];
    await invalidateCache(client, patterns);

    return {
      data: { ...updatedTeacher, teacherPersonalDetails },
    };
  } catch (error) {
    handlePrismaError(error);
  }
};
