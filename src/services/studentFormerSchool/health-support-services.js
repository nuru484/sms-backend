// src/services/studentFormerSchool/health-support-services.js

import {
  createHealthAndSupportDetails,
  updateHealthAndSupportDetails,
} from '../../repositories/studentFormerSchool/health-support-repository.js';

import { getStudentByUserId } from '../../repositories/studentDetails/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

// ################################################################################################

// Function to create health and support details for a student
export const createHealthAndSupportForStudent = async (
  studentId,
  formerSchoolId,
  healthAndSupportData
) => {
  const { healthRecords, specialNeeds } = healthAndSupportData;

  try {
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

    return healthAndSupport;
  } catch (error) {
    handlePrismaError(error, 'Former school');
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

    return updatedHealthAndSupport;
  } catch (error) {
    handlePrismaError(error, 'Health and Support');
  }
};
