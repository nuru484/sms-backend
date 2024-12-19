// src/services/userRegistration/teacher-registration-service.js

// Import required repository functions for user and teacher data handling
import {
  createUserBasicDetails,
  createUserAddress,
} from '../../repositories/userRegistration/general-user-registration-repository.js';
import { createTeacherPersonalDetails } from '../../repositories/userRegistration/teacher-registration-repository.js';

import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import prisma from '../../config/prismaClient.js'; // Assuming you're using Prisma for database operations
import { uploadFileToCloudinary } from '../../config/claudinary.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

/**
 * Main function to process teacher registration.
 *
 * @param {Object} payload - The payload containing teacher registration details.
 * @returns {Promise<Object>} - Returns a success message if registration is successful.
 * @throws {CustomError} - Throws an error if any step in the process fails.
 */
const processTeacherRegistration = async (payload, payloadFiles) => {
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

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Step 2: Create Teacher User Record
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
        tx, // Pass transaction object to repository
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
        tx, // Pass transaction object to repository
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
        tx, // Pass transaction object to repository
      });

      logger.info('Teacher address successfully created.');

      return {
        message: 'Teacher registration successful.',
      };
    });

    return result; // Return the result of the transaction
  } catch (error) {
    handlePrismaError(error, 'Teacher Registration');
  }
};

export default processTeacherRegistration;
