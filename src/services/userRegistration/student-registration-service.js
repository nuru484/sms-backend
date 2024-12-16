// src/services/userRegistration/student-registration-service.js

// Import required repository functions for user and student data handling
import {
  createUserBasicDetails,
  createUserAddress,
} from '../../repositories/userRegistration/general-user-registration-repository.js';

import {
  createStudentPersonalDetails,
  createParentPersonalDetails,
} from '../../repositories/userRegistration/student-registration-repository.js';

import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import { uploadFileToCloudinary } from '../../config/claudinary.js';

// Main function to process student registration
const processStudentRegistration = async (payload, profilePhotos) => {
  // Destructure all required fields from the payload
  const {
    studentFatherFirstName,
    studentFatherMiddleName,
    studentFatherLastName,
    studentFatherPhoneNumber,
    studentFatherGender,
    studentFatherUsername,
    studentFatherRole,
    studentFatherRelationshipToStudent,
    studentFatherEmail,

    studentMotherFirstName,
    studentMotherMiddleName,
    studentMotherLastName,
    studentMotherPhoneNumber,
    studentMotherGender,
    studentMotherUsername,
    studentMotherRole,
    studentMotherRelationshipToStudent,
    studentMotherEmail,

    studentFirstName,
    studentMiddleName,
    studentLastName,
    studentGender,
    ethnicity,
    studentRole,
    dateOfBirth,
    admissionStatus,
    studentUsername,
    password,

    city,
    country,
    region,
    postalCode,
    digitalAddress,
  } = payload;

  const { studentProfilePhoto, fatherProfilePhoto, motherProfilePhoto } =
    profilePhotos;

  try {
    // Step 1: Create Student User Record
    const studentProfilePhotoUrl = await uploadFileToCloudinary(
      studentProfilePhoto[0]
    );

    const student = await createUserBasicDetails({
      firstName: studentFirstName,
      middleName: studentMiddleName,
      lastName: studentLastName,
      username: studentUsername,
      role: studentRole,
      gender: studentGender,
      profilePhoto: studentProfilePhotoUrl,
      password,
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
    const fatherProfilePhotoUrl = await uploadFileToCloudinary(
      fatherProfilePhoto[0]
    );

    const studentFather = await createUserBasicDetails({
      firstName: studentFatherFirstName,
      middleName: studentFatherMiddleName,
      lastName: studentFatherLastName,
      username: studentFatherUsername,
      password,
      role: studentFatherRole,
      gender: studentFatherGender,
      profilePhoto: fatherProfilePhotoUrl,
      phoneNumber: studentFatherPhoneNumber,
      email: studentFatherEmail,
    });

    // Step 6: Create Father Personal Details
    const studentFatherPersonalDetails = await createParentPersonalDetails({
      relationshipToStudent: studentFatherRelationshipToStudent,
      userId: studentFather.id,
      wardsIds: [studentPersonalDetails.id],
    });

    // Step 8: Create Mother User Record
    const motherProfilePhotoUrl = await uploadFileToCloudinary(
      motherProfilePhoto[0]
    );

    const studentMother = await createUserBasicDetails({
      firstName: studentMotherFirstName,
      middleName: studentMotherMiddleName,
      lastName: studentMotherLastName,
      username: studentMotherUsername,
      password,
      role: studentMotherRole,
      gender: studentMotherGender,
      profilePhoto: motherProfilePhotoUrl,
      phoneNumber: studentMotherPhoneNumber,
      email: studentMotherEmail,
    });

    // Step 9: Create Mother Personal Details
    const studentMotherPersonalDetails = await createParentPersonalDetails({
      relationshipToStudent: studentMotherRelationshipToStudent,
      userId: studentMother.id,
      wardsIds: [studentPersonalDetails.id],
    });

    // Return success message after all steps are successfully completed
    return {
      message: 'Student registration successful.',
      'admission status': admissionStatus, // The admission status is set to pending initially
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
