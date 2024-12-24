// src/services/studentBehavior/student-behavior-services.js

import {
  createStudentBehavior,
  updateStudentBehavior,
  getStudentBehavior,
  deleteStudentBehavior,
  getStudentBehaviors,
} from '../../repositories/student-behavior/student-behavior-repository.js';
import { getStudentById } from '../../repositories/users/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

/**
 * Service function to create a student behavior record.
 */
export const createStudentBehaviorDetails = async (
  studentId,
  reporterId,
  behaviorData
) => {
  try {
    const student = await getStudentById(studentId);

    if (!student) {
      throw new CustomError(404, `Student with ID ${studentId} not found.`);
    }

    const newStudentBehavior = await createStudentBehavior(
      studentId,
      reporterId,
      behaviorData
    );

    return newStudentBehavior;
  } catch (error) {
    handlePrismaError(error, 'student behavior');
  }
};

/**
 * Service function to update a student behavior record by ID.
 */
export const updateStudentBehaviorDetails = async (
  behaviorId,
  behaviorData
) => {
  try {
    const studentBehavior = await getStudentBehavior(behaviorId);

    if (!studentBehavior) {
      throw new CustomError(
        404,
        `Student Behavior with ID ${behaviorId} not found.`
      );
    }

    const updatedStudentBehavior = await updateStudentBehavior(
      behaviorId,
      behaviorData
    );

    return updatedStudentBehavior;
  } catch (error) {
    handlePrismaError(error, 'student behavior');
  }
};

/**
 * Service function to get a student behavior record by ID.
 */
export const getStudentBehaviorDetails = async (behaviorId) => {
  try {
    const studentBehavior = await getStudentBehavior(behaviorId);

    if (!studentBehavior) {
      throw new CustomError(
        404,
        `Student Behavior with ID ${behaviorId} not found.`
      );
    }

    return studentBehavior;
  } catch (error) {
    handlePrismaError(error, 'student behavior');
  }
};

/**
 * Service function to delete a student behavior record by ID.
 */
export const deleteStudentBehaviorDetails = async (behaviorId) => {
  try {
    const deletedStudentBehavior = await deleteStudentBehavior(behaviorId);

    if (!deletedStudentBehavior) {
      throw new CustomError(
        404,
        `Student Behavior with ID ${behaviorId} not found.`
      );
    }

    return deletedStudentBehavior;
  } catch (error) {
    handlePrismaError(error, 'student behavior');
  }
};

/**
 * Service function to get all behavior records for a student.
 */
export const getAllStudentBehaviorsDetails = async (
  studentId,
  options = {}
) => {
  try {
    const response = await getStudentBehaviors(studentId, options);

    if (!response || response.studentBehaviors.length === 0) {
      throw new CustomError(
        404,
        `There are no behavior records for student ID ${studentId}.`
      );
    }

    return response;
  } catch (error) {
    handlePrismaError(error, 'student behavior');
  }
};
