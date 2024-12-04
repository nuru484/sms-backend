// src/services/userRegistration/student-registration-service.js

// Import required repository functions for user and student data handling
import {
  createUserBasicDetails,
  createUserAddress,
} from '../../repositories/userRegistration/general-user-registration-repository.js';

import {
  createStudentPersonalDetails,
  createStudentParentRelation,
  createParentPersonalDetails,
} from '../../repositories/userRegistration/student-registration-repository.js';

import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

// Main function to process student registration
const processStudentRegistration = async (payload) => {
  // Destructure all required fields from the payload
  const {
    studentFatherFirstName,
    studentFatherMiddleName,
    studentFatherLastName,
    studentFatherProfilePhoto,
    studentFatherPhoneNumber,
    studentFatherGender,
    studentFatherUsername,
    studentFatherRole,
    studentFatherRelationshipToStudent,
    studentFatherEmail,

    studentMotherFirstName,
    studentMotherMiddleName,
    studentMotherLastName,
    studentMotherProfilePhoto,
    studentMotherPhoneNumber,
    studentMotherGender,
    studentMotherUsername,
    studentMotherRole,
    studentMotherRelationshipToStudent,
    studentMotherEmail,

    studentFirstName,
    studentMiddleName,
    studentLastName,
    studentProfilePhoto,
    studentGender,
    ethnicity,
    studentRole,
    dateOfBirth,
    admissionStatus,
    studentUsername,

    city,
    country,
    region,
    postalCode,
    digitalAddress,
  } = payload;

  try {
    // Step 1: Create Student User Record
    const student = await createUserBasicDetails({
      firstName: studentFirstName,
      middleName: studentMiddleName,
      lastName: studentLastName,
      username: studentUsername,
      role: studentRole,
      gender: studentGender,
      profilePhoto: studentProfilePhoto,
      dateOfBirth,
    });

    // Step 3: Create Student Personal Details
    const studentPersonalDetails = await createStudentPersonalDetails({
      ethnicity,
      admissionStatus,
      userId: student.id, // Use the student's ID for reference
    });

    // Step 4: Create Student Address
    const studentAddress = await createUserAddress({
      city,
      country,
      region,
      postalCode,
      digitalAddress,
      userId: student.id,
    });

    // Step 5: Create Father User Record
    const studentFather = await createUserBasicDetails({
      firstName: studentFatherFirstName,
      middleName: studentFatherMiddleName,
      lastName: studentFatherLastName,
      username: studentFatherUsername,
      role: studentFatherRole,
      gender: studentFatherGender,
      profilePhoto: studentFatherProfilePhoto,
      phoneNumber: studentFatherPhoneNumber,
      email: studentFatherEmail,
    });

    // Step 6: Create Father Personal Details
    const studentFatherPersonalDetails = await createParentPersonalDetails({
      relationshipToStudent: studentFatherRelationshipToStudent,
      userId: studentFather.id,
    });

    // Step 7: Connect Father to Student
    const connectStudentToFather = await createStudentParentRelation({
      studentId: studentPersonalDetails.id,
      parentId: studentFatherPersonalDetails.id,
    });

    // Step 8: Create Mother User Record
    const studentMother = await createUserBasicDetails({
      firstName: studentMotherFirstName,
      middleName: studentMotherMiddleName,
      lastName: studentMotherLastName,
      username: studentMotherUsername,
      role: studentMotherRole,
      gender: studentMotherGender,
      profilePhoto: studentMotherProfilePhoto,
      phoneNumber: studentMotherPhoneNumber,
      email: studentMotherEmail,
    });

    // Step 9: Create Mother Personal Details
    const studentMotherPersonalDetails = await createParentPersonalDetails({
      relationshipToStudent: studentMotherRelationshipToStudent,
      userId: studentMother.id,
    });

    // Step 10: Connect Mother to Student
    const connectStudentToMother = await createStudentParentRelation({
      studentId: studentPersonalDetails.id,
      parentId: studentMotherPersonalDetails.id,
    });

    // Return success message after all steps are successfully completed
    return {
      message: 'Student registration successful.',
      admissionStatus: 'PENDING', // The admission status is set to pending initially
    };
  } catch (error) {
    // Log the error details for debugging purposes
    logger.error({
      'Error processing student registration': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a custom error with an appropriate error message
    throw new CustomError(500, `Student registration failed: ${error.message}`);
  }
};

// Export the student registration service for use elsewhere in the application
export default processStudentRegistration;
