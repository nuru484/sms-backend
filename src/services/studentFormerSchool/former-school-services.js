import { createFormerSchoolDetails } from '../../repositories/studentFormerSchool/former-school-repository.js';
import { getStudentByUserId } from '../../repositories/student/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

export const createFormerSchoolForStudent = async (
  userId,
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
      `Attempting to create former school details for userId: ${userId}`
    );

    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentByUserId(parseInt(userId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot create former school details.'
      );
    }

    const studentId = parseInt(student.id);

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
      studentId, // Connect the former school to the student
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
