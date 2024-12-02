import {
  createUserBasicDetails,
  createUserAddress,
} from '../../repositories/userRegistration/generalUserRegistrationRepos.js';

import {
  createStudentPersonalDetails,
  createStudentPreviousSchool,
  createStudentParentRelation,
  createParentPersonalDetails,
} from '../../repositories/userRegistration/studentRegistration.js';
import prisma from '../../../prismaClient.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

const processStudentRegistration = async (payload) => {
  const {
    studentFatherFirstName,
    studentFatherMiddleName,
    studentFatherLastName,
    studentFatherProfilePhoto,
    studentFatherPhoneNumber,
    studentFatherGender,
    studentFatherUsername,
    studentFatherRelationshipToStudent,
    studentFatherEmail,

    studentMotherFirstName,
    studentMotherMiddleName,
    studentMotherLastName,
    studentMotherProfilePhoto,
    studentMotherPhoneNumber,
    studentMotherGender,
    studentMotherUsername,
    studentMotherRelationshipToStudent,
    studentMotherEmail,

    studentFirstName,
    studentMiddleName,
    studentLastName,
    studentProfilePhoto,
    studentGender,
    ethnicity,
    previousSchoolName,
    previousSchoolLevel,
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
    return await prisma.$transaction(async (tx) => {
      // Create Student User
      const student = await createUserBasicDetails({
        firstName: studentFirstName,
        middleName: studentMiddleName,
        lastName: studentLastName,
        username: studentUsername,
        gender: studentGender,
        profilePhoto: studentProfilePhoto,
      });

      // Create Previous School Details if Provided
      const studentPreviousSchool =
        previousSchoolName && previousSchoolLevel
          ? await createStudentPreviousSchool({
              previousSchoolName,
              previousSchoolLevel,
            })
          : null;

      // Create Student Personal Details
      const studentPersonalDetails = await createStudentPersonalDetails({
        dateOfBirth,
        ethnicity,
        admissionStatus,
        userId: student.id, // Use the correct ID
        studentPreviousSchoolId: studentPreviousSchool?.id || null,
      });

      // Create Student Address
      const studentAddress = await createUserAddress({
        city,
        country,
        region,
        postalCode,
        digitalAddress,
        userId: student.id,
      });

      // Create Father User
      const studentFather = await createUserBasicDetails({
        firstName: studentFatherFirstName,
        middleName: studentFatherMiddleName,
        lastName: studentFatherLastName,
        username: studentFatherUsername,
        gender: studentFatherGender,
        profilePhoto: studentFatherProfilePhoto,
        phoneNumber: studentFatherPhoneNumber,
        email: studentFatherEmail,
      });

      // Create Father Personal Details
      const studentFatherPersonalDetails = await createParentPersonalDetails({
        relationshipToStudent: studentFatherRelationshipToStudent,
        userId: studentFather.id,
      });

      // Connect Father to Student
      const connectStudentToFather = await createStudentParentRelation({
        studentId: student.id,
        parentId: studentFatherPersonalDetails.id,
      });

      // Create Mother User
      const studentMother = await createUserBasicDetails({
        firstName: studentMotherFirstName,
        middleName: studentMotherMiddleName,
        lastName: studentMotherLastName,
        username: studentMotherUsername,
        gender: studentMotherGender,
        profilePhoto: studentMotherProfilePhoto,
        phoneNumber: studentMotherPhoneNumber,
        email: studentMotherEmail,
      });

      // Create Mother Personal Details
      const studentMotherPersonalDetails = await createParentPersonalDetails({
        relationshipToStudent: studentMotherRelationshipToStudent,
        userId: studentMother.id,
      });

      // Connect Mother to Student
      const connectStudentToMother = await createStudentParentRelation({
        studentId: student.id,
        parentId: studentMotherPersonalDetails.id,
      });

      return {
        message: 'Student registration successful.',
        admissionStatus: 'PENDING',
      };
    });
  } catch (error) {
    logger.error({
      'Error processing Transaction status': {
        error: error.message,
        stack: error.stack,
      },
    });

    throw new CustomError(500, `Student registration failed: ${error.message}`);
  }
};

export default processStudentRegistration;
