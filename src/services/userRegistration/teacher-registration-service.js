// src/services/userRegistration/teacher-registration-service.js

// Import required repository functions for user and teacher data handling
import {
  createUserBasicDetails,
  createUserAddress,
} from '../../repositories/userRegistration/general-user-registration-repository.js';

import {
  createTeacherPersonalDetails,
  createTeacherCourseRelation,
  createTeacherClassRelation,
} from '../../repositories/userRegistration/teacher-registration-repository.js';

import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

/**
 * Main function to process teacher registration.
 *
 * @param {Object} payload - The payload containing teacher registration details.
 * @returns {Promise<Object>} - Returns a success message if registration is successful.
 * @throws {CustomError} - Throws an error if any step in the process fails.
 */
const processTeacherRegistration = async (payload) => {
  // Destructure all required fields from the payload
  const {
    firstName,
    middleName,
    lastName,
    username,
    role,
    gender,
    profilePhoto,
    dateOfBirth,
    digitalSignature,
    spokenLanguages,
    socialMediaHandles,
    maritalStatus,
    city,
    country,
    region,
    postalCode,
    digitalAddress,
    courseId,
    classId,
  } = payload;

  try {
    // Step 1: Create Teacher User Record
    const teacher = await createUserBasicDetails({
      firstName,
      middleName,
      lastName,
      username,
      role,
      gender,
      profilePhoto,
      dateOfBirth,
    });

    logger.info('Teacher user record successfully created.');

    // Step 2: Create Teacher Personal Details
    const teacherPersonalDetails = await createTeacherPersonalDetails({
      digitalSignature,
      spokenLanguages,
      socialMediaHandles,
      maritalStatus,
      userId: teacher.id, // Use the teacher's ID for reference
    });

    logger.info('Teacher personal details successfully created.');

    // Step 3: Create Teacher Address
    const teacherAddress = await createUserAddress({
      city,
      country,
      region,
      postalCode,
      digitalAddress,
      userId: teacher.id,
    });

    logger.info('Teacher address successfully created.');

    // Step 4: Connect Teacher to Course
    const teacherCourseRelation = await createTeacherCourseRelation({
      teacherId: teacherPersonalDetails.id,
      courseId: parseInt(courseId), // Connect to the course using the course ID from the payload
    });

    logger.info('Teacher successfully connected to course.');

    // Step 5: Connect Teacher to Class
    const teacherClassRelation = await createTeacherClassRelation({
      teacherId: teacherPersonalDetails.id,
      classId: parseInt(classId), // Connect to the class using the class ID from the payload
    });

    logger.info('Teacher successfully connected to class.');

    // Return success message after all steps are successfully completed
    return {
      message: 'Teacher registration successful.',
    };
  } catch (error) {
    // Log the error details for debugging purposes
    logger.error({
      'Error processing teacher registration': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a custom error with an appropriate error message
    throw new CustomError(500, `Teacher registration failed: ${error.message}`);
  }
};

// Export the teacher registration service for use elsewhere in the application
export default processTeacherRegistration;
