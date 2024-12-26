import {
  createFormerSchoolDetails,
  updateFormerSchoolDetails,
} from '../../repositories/studentFormerSchool/former-school-repository.js';
import { getStudentById } from '../../repositories/users/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

export const createFormerSchoolForStudent = async (
  studentId,
  formerSchoolData
) => {
  try {
    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentById(parseInt(studentId));

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
    const formerSchool = await createFormerSchoolDetails(
      studentId,
      formerSchoolData
    );

    return formerSchool;
  } catch (error) {
    handlePrismaError(error);
  }
};

export const updateFormerSchoolForStudent = async (
  studentId,
  formerSchoolId,
  updateData
) => {
  try {
    // Step 1: Check if the student exists and their admission status
    const student = await getStudentById(parseInt(studentId));

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

    return updatedFormerSchool;
  } catch (error) {
    handlePrismaError(error, 'Former School');
  }
};
