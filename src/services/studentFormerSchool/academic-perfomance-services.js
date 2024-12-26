// src/services/studentFormerSchool/academic-perfomance-services.js
import {
  createAcademicPerformanceDetails,
  updateAcademicPerformanceDetails,
} from '../../repositories/studentFormerSchool/academic-perfomance-repository.js';
import { getStudentById } from '../../repositories/users/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { client } from '../../config/redis.js';

// Function to create academic performance for a student
export const createAcademicPerformanceForStudent = async (
  studentId,
  formerSchoolId,
  academicPerformanceData
) => {
  try {
    // Step 1: Check the student's admission status before proceeding
    const student = await getStudentById(studentId);

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
    const academicPerformance = await createAcademicPerformanceDetails(
      formerSchoolId,
      academicPerformanceData
    );

    const studentFormerDetailsCacheKey = `formerSchoolDetails:student:${studentId}`;
    client.del(studentFormerDetailsCacheKey); // Invalidate the cache

    return academicPerformance;
  } catch (error) {
    handlePrismaError(error, 'Former School');
  }
};

// Function to update academic performance for a student
export const updateAcademicPerformanceForStudent = async (
  studentId,
  academicPerformanceId,
  updateData
) => {
  try {
    // Step 1: Check if the student exists and their admission status
    const student = await getStudentById(studentId);

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
      academicPerformanceId,
      updateData
    );

    const studentFormerDetailsCacheKey = `formerSchoolDetails:student:${studentId}`;
    client.del(studentFormerDetailsCacheKey); // Invalidate the cache

    return updatedAcademicPerformance;
  } catch (error) {
    handlePrismaError(error, 'Academic perfomance');
  }
};
