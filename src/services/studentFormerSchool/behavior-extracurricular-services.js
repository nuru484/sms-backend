// src/services/studentFormerSchool/behavior-extracurricular-services.js

import {
  createBehaviorAndExtracurricularDetails,
  updateBehaviorAndExtracurricularDetails,
} from '../../repositories/studentFormerSchool/behavior-extracurricular-repository.js';

import { getStudentByUserId } from '../../repositories/studentDetails/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

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
    // Log the attempt to create behavior and extracurricular details for student
    logger.info(
      `Attempting to create behavior and extracurricular details for studentId: ${studentId}`
    );

    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentByUserId(parseInt(studentId));

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

    // Log success
    logger.info(
      `Behavior and extracurricular details successfully created for student ID: ${student.id}`
    );

    return behaviorAndExtracurricular;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error creating behavior and extracurricular details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
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
    // Log the attempt to update behavior and extracurricular details for the student
    logger.info(
      `Attempting to update behavior and extracurricular details for studentId: ${studentId}, behaviorAndExtracurricularId: ${behaviorAndExtracurricularId}`
    );

    // Step 1: Check if the student exists and their admission status
    const student = await getStudentByUserId(parseInt(studentId));

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

    // Log success
    logger.info(
      `Behavior and extracurricular details successfully updated for behaviorAndExtracurricularId: ${behaviorAndExtracurricularId}`
    );

    return updatedBehaviorAndExtracurricular;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error updating behavior and extracurricular details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Rethrow the error for the controller to handle
    throw error;
  }
};
