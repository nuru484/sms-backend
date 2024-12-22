// src/services/userRegistration/student-registration-service.js

// Import required repository functions for user and student data handling
import {
  createUserBasicDetails,
  updateUserBasicDetails,
} from '../../repositories/userRegistration/general-user-registration-repository.js';
import { createUserAddress } from '../address/address-services.js';
import {
  createStudentPersonalDetails,
  createParentPersonalDetails,
  updateStudentPersonalDetails,
  updateParentPersonalDetails,
} from '../../repositories/userRegistration/student-registration-repository.js';

import { getStudentById } from '../../repositories/userDetails/studentDetails/student-repository.js';
import logger from '../../utils/logger.js';
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from '../../config/claudinary.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import prisma from '../../config/prismaClient.js';
import { checkUniquenessOnUpdate } from '../../utils/helpers/validation-helpers.js';

// Main function to process student registration
export const processStudentRegistration = async (payload, profilePhotos) => {
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

    logger.info(`Student basic details created successfully.`);

    // Step 3: Create Student Personal Details
    const studentPersonalDetails = await createStudentPersonalDetails({
      ethnicity,
      admissionStatus,
      userId: student.id, // Use the student's ID for reference
    });

    logger.info(`Student personal details created successfully.`);

    // Step 4: Create Student Address
    const studentAddress = await createUserAddress({
      city,
      country,
      region,
      postalCode,
      digitalAddress,
      userId: student.id,
    });

    logger.info(`Student address created successfully.`);

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

    logger.info(`Student father basic details created successfully.`);

    // Step 6: Create Father Personal Details
    const studentFatherPersonalDetails = await createParentPersonalDetails({
      relationshipToStudent: studentFatherRelationshipToStudent,
      userId: studentFather.id,
      wardsIds: [studentPersonalDetails.id],
    });

    logger.info(`Student father personal details created successfully.`);

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

    logger.info(`Student mother basic details created successfully.`);

    // Step 9: Create Mother Personal Details
    const studentMotherPersonalDetails = await createParentPersonalDetails({
      relationshipToStudent: studentMotherRelationshipToStudent,
      userId: studentMother.id,
      wardsIds: [studentPersonalDetails.id],
    });

    logger.info(`Student mother personal details created successfully.`);

    // Return success message after all steps are successfully completed
    return {
      message: 'Student registration successful.',
      'admission status': admissionStatus, // The admission status is set to pending initially
    };
  } catch (error) {
    handlePrismaError(error);
  }
};

// Service function to update basic and personal details of a student
export const updateStudentBasicAndPersonalDetails = async (
  studentId,
  payload,
  profilePhoto
) => {
  try {
    const {
      studentFirstName,
      studentMiddleName,
      studentLastName,
      studentGender,
      studentUsername,
      studentRole,
      dateOfBirth,
      studentPhoneNumber,
      ethnicity,
    } = payload;

    const student = await getStudentById(studentId);
    if (!student) {
      throw new CustomError(400, `Student with ID ${studentId} not found!`);
    }

    await checkUniquenessOnUpdate(
      'user',
      'username',
      studentUsername,
      student.user.id
    );

    const studentProfilePhotoUrl =
      profilePhoto && (await uploadFileToCloudinary(profilePhoto));

    if (student.user.profilePhoto) {
      await deleteFileFromCloudinary(student.user.profilePhoto);
    }

    const updatedStudent = await updateUserBasicDetails(student.user.id, {
      firstName: studentFirstName,
      middleName: studentMiddleName,
      lastName: studentLastName,
      profilePhoto: studentProfilePhotoUrl,
      gender: studentGender,
      username: studentUsername,
      role: studentRole,
      dateOfBirth,
      phoneNumber: studentPhoneNumber,
    });

    logger.info(`Student basic details updated successfully.`);

    const studentPersonalDetails = await updateStudentPersonalDetails(
      student.id,
      { ethnicity }
    );
    logger.info(`Student personal details updated successfully.`);

    return updatedStudent;
  } catch (error) {
    handlePrismaError(error);
  }
};

// Service function to update parent details (works for both father and mother)
export const updateParentDetails = async (parentId, payload, profilePhoto) => {
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
      relationshipToStudent,
      wardsIds,
    } = payload;

    const parent = await prisma.parent.findUnique({
      where: { id: parseInt(parentId) },
      include: { user: { include: { address: true } } },
    });

    if (!parent) {
      throw new CustomError(400, `Parent with ID ${parentId} not found!`);
    }

    await checkUniquenessOnUpdate('user', 'email', email, parent.user.id);
    await checkUniquenessOnUpdate('user', 'username', username, parent.user.id);

    // Check and validate wardsIds for each class
    if (Array.isArray(wardsIds) && wardsIds.length > 0) {
      const wardsValidationPromises = wardsIds.map(async (wardId) => {
        const ward = await prisma.student.findUnique({
          where: { id: parseInt(wardId) },
        });

        if (!ward) {
          throw new CustomError(404, `Ward with ID ${wardId} not found.`);
        }
      });

      // Wait for all wards validations to complete
      await Promise.all(wardsValidationPromises);
    } else if (wardsIds) {
      // Handle the case where wardsIds is not an array but is defined
      throw new CustomError(400, 'Invalid wardsIds. Expected an array.');
    }

    const profilePhotoUrl =
      profilePhoto && (await uploadFileToCloudinary(profilePhoto));

    if (parent.user.profilePhoto) {
      await deleteFileFromCloudinary(parent.user.profilePhoto);
    }

    const updatedParent = await updateUserBasicDetails(parent.user.id, {
      firstName,
      middleName,
      lastName,
      profilePhoto: profilePhotoUrl,
      gender,
      username,
      role,
      email,
      phoneNumber,
    });

    logger.info(`Parent basic details updated successfully.`);

    const parentPersonalDetails = await updateParentPersonalDetails(
      parent.id,
      { relationshipToStudent },
      wardsIds
    );

    logger.info(`Parent personal details updated successfully.`);

    return updatedParent;
  } catch (error) {
    handlePrismaError(error);
  }
};
