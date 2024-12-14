// src/services/studentFormerSchool/academic-perfomance-services.js

import {
  createAcademicPerformanceDetails,
  updateAcademicPerformanceDetails,
} from '../../repositories/studentFormerSchool/academic-perfomance-repository.js';

import { getStudentByUserId } from '../../repositories/studentDetails/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

// ################################################################################################

// Function to create academic performance for a student
export const createAcademicPerformanceForStudent = async (
  studentId,
  formerSchoolId,
  academicPerformanceData
) => {
  const {
    previousGrade,
    promotionStatus,
    courses,
    grades,
    classRanking,
    specialPrograms,
  } = academicPerformanceData;

  try {
    // Log the attempt to create academic performance for student
    logger.info(
      `Attempting to create academic performance details for studentId: ${studentId}`
    );

    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot create academic performance details.'
      );
    }

    // Step 2: Proceed to create the academic performance details
    const academicPerformance = await createAcademicPerformanceDetails({
      previousGrade,
      promotionStatus,
      courses,
      grades,
      classRanking,
      specialPrograms,
      formerSchoolId: parseInt(formerSchoolId), // Link academic performance to the former school
    });

    // Log success
    logger.info(
      `Academic performance details successfully created for student ID: ${student.id}`
    );

    return academicPerformance;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error creating academic performance details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

// ################################################################################################

// Function to update academic performance for a student
export const updateAcademicPerformanceForStudent = async (
  studentId,
  academicPerformanceId,
  updateData
) => {
  try {
    // Log the attempt to update academic performance for the student
    logger.info(
      `Attempting to update academic performance details for studentId: ${studentId}, academicPerformanceId: ${academicPerformanceId}`
    );

    // Step 1: Check if the student exists and their admission status
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot update academic performance details.'
      );
    }

    // Step 2: Update the academic performance details
    const updatedAcademicPerformance = await updateAcademicPerformanceDetails(
      parseInt(academicPerformanceId),
      updateData
    );

    // Log success
    logger.info(
      `Academic performance details successfully updated for academicPerformanceId: ${academicPerformanceId}`
    );

    return updatedAcademicPerformance;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error updating academic performance details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Rethrow the error for the controller to handle
    throw error;
  }
};
