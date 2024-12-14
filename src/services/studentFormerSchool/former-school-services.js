import {
  createFormerSchoolDetails,
  updateFormerSchoolDetails,
} from '../../repositories/studentFormerSchool/former-school-repository.js';
import { getStudentByUserId } from '../../repositories/studentDetails/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

export const createFormerSchoolForStudent = async (
  studentId,
  formerSchoolData
) => {
  const {
    name,
    address,
    contactNumber,
    email,
    schoolType,
    startDate,
    endDate,
    reasonForLeaving,
  } = formerSchoolData;

  try {
    // Log the attempt to create former school for student
    logger.info(
      `Attempting to create former school details for studentId: ${studentId}`
    );

    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot create former school details.'
      );
    }

    // Step 2: Proceed to create the former school details
    const formerSchool = await createFormerSchoolDetails({
      name,
      address,
      contactNumber,
      email,
      schoolType,
      startDate,
      endDate,
      reasonForLeaving,
      studentId: parseInt(student.id), // Connect the former school to the student
    });

    // Log success
    logger.info(
      `Former school details successfully created for student ID: ${student.id}`
    );

    return formerSchool;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error creating former school details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

/// ##############################################################################################

export const updateFormerSchoolForStudent = async (
  studentId,
  formerSchoolId,
  updateData
) => {
  try {
    // Log the attempt to update former school for the student
    logger.info(
      `Attempting to update former school details for studentId: ${studentId}, formerSchoolId: ${formerSchoolId}`
    );

    // Step 1: Check if the student exists and their admission status
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot update former school details.'
      );
    }

    // Step 2: Update the former school details
    const updatedFormerSchool = await updateFormerSchoolDetails(
      parseInt(formerSchoolId),
      updateData
    );

    // Log success
    logger.info(
      `Former school details successfully updated for formerSchoolId: ${formerSchoolId}`
    );

    return updatedFormerSchool;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error updating former school details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Rethrow the error for the controller to handle
    throw error;
  }
};
