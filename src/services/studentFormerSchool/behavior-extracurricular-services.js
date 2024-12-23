// src/services/studentFormerSchool/behavior-extracurricular-services.js

import {
  createBehaviorAndExtracurricularDetails,
  updateBehaviorAndExtracurricularDetails,
} from '../../repositories/studentFormerSchool/behavior-extracurricular-repository.js';

import { getStudentById } from '../../repositories/users/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

// ################################################################################################

// Function to create behavior and extracurricular details for a student
export const createBehaviorAndExtracurricularForStudent = async (
  studentId,
  formerSchoolId,
  behaviorAndExtracurricularData
) => {
  const {
    behaviorRecord,
    disciplinaryActions,
    extracurriculars,
    achievements,
  } = behaviorAndExtracurricularData;

  try {
    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentById(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot create behavior and extracurricular details.'
      );
    }

    // Step 2: Proceed to create the behavior and extracurricular details
    const behaviorAndExtracurricular =
      await createBehaviorAndExtracurricularDetails({
        behaviorRecord,
        disciplinaryActions,
        extracurriculars,
        achievements,
        formerSchoolId: parseInt(formerSchoolId), // Link behavior and extracurricular details to the former school
      });

    return behaviorAndExtracurricular;
  } catch (error) {
    handlePrismaError(error, 'Former school');
  }
};

// ################################################################################################

// Function to update behavior and extracurricular details for a student
export const updateBehaviorAndExtracurricularForStudent = async (
  studentId,
  behaviorAndExtracurricularId,
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
        'Student is not admitted. Cannot update behavior and extracurricular details.'
      );
    }

    // Step 2: Update the behavior and extracurricular details
    const updatedBehaviorAndExtracurricular =
      await updateBehaviorAndExtracurricularDetails(
        parseInt(behaviorAndExtracurricularId),
        updateData
      );

    return updatedBehaviorAndExtracurricular;
  } catch (error) {
    handlePrismaError(error, 'Behavior and Extracurricular');
  }
};
