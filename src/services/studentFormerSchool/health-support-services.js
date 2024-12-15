// src/services/studentFormerSchool/health-support-services.js

import {
  createHealthAndSupportDetails,
  updateHealthAndSupportDetails,
} from '../../repositories/studentFormerSchool/health-support-repository.js';

import { getStudentByUserId } from '../../repositories/studentDetails/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';

// ################################################################################################

// Function to create health and support details for a student
export const createHealthAndSupportForStudent = async (
  studentId,
  formerSchoolId,
  healthAndSupportData
) => {
  const { healthRecords, specialNeeds } = healthAndSupportData;

  try {
    // Log the attempt to create health and support for student
    logger.info(
      `Attempting to create health and support details for studentId: ${studentId}`
    );

    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot create health and support details.'
      );
    }

    // Step 2: Proceed to create the health and support details
    const healthAndSupport = await createHealthAndSupportDetails({
      healthRecords,
      specialNeeds,
      formerSchoolId: parseInt(formerSchoolId), // Link health and support to the former school
    });

    // Log success
    logger.info(
      `Health and support details successfully created for student ID: ${student.id}`
    );

    return healthAndSupport;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error creating health and support details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw the error to be handled at the controller level
    throw error;
  }
};

// ################################################################################################

// Function to update health and support details for a student
export const updateHealthAndSupportForStudent = async (
  studentId,
  healthAndSupportId,
  updateData
) => {
  try {
    // Log the attempt to update health and support for the student
    logger.info(
      `Attempting to update health and support details for studentId: ${studentId}, healthAndSupportId: ${healthAndSupportId}`
    );

    // Step 1: Check if the student exists and their admission status
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found.');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot update health and support details.'
      );
    }

    // Step 2: Update the health and support details
    const updatedHealthAndSupport = await updateHealthAndSupportDetails(
      parseInt(healthAndSupportId),
      updateData
    );

    // Log success
    logger.info(
      `Health and support details successfully updated for healthAndSupportId: ${healthAndSupportId}`
    );

    return updatedHealthAndSupport;
  } catch (error) {
    // Log any errors that occur
    logger.error({
      'Error updating health and support details': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Rethrow the error for the controller to handle
    throw error;
  }
};
