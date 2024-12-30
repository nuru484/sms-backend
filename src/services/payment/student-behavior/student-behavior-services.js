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
import { saveToCache, client } from '../../config/redis.js';
import { cli } from 'winston/lib/winston/config/index.js';

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

    const studentBehaviorsCacheKey = `studentBehaviors:student:${studentId}`;
    client.del(studentBehaviorsCacheKey);

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

    const studentBehaviorCacheKey = `studentBehavior:${behaviorId}`;
    const studentBehaviorsCacheKey = `studentBehaviors:student:${studentBehavior.studentId}`;
    client.del(studentBehaviorCacheKey);
    client.del(studentBehaviorsCacheKey);

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

    const studentBehaviorCacheKey = `studentBehavior:${behaviorId}`;
    saveToCache(studentBehaviorCacheKey, studentBehavior);

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
    // Find the student behavior record first to get associated data
    const studentBehavior = await prisma.studentBehavior.findUnique({
      where: { id: behaviorId },
      include: { disciplinaryAction: true }, // Include related disciplinary actions
    });

    if (!studentBehavior) {
      throw new CustomError(
        404,
        `Student Behavior with ID ${behaviorId} not found.`
      );
    }

    // Delete associated disciplinary actions if they exist
    if (studentBehavior.disciplinaryAction.length > 0) {
      await prisma.disciplinaryAction.deleteMany({
        where: {
          id: {
            in: studentBehavior.disciplinaryAction.map((action) => action.id),
          },
        },
      });
    }

    // Delete the student behavior record
    const deletedStudentBehavior = await prisma.studentBehavior.delete({
      where: { id: behaviorId },
    });

    // Invalidate the cache for the student behavior and the student's behaviors list
    const studentBehaviorCacheKey = `studentBehavior:${behaviorId}`;
    const studentBehaviorsCacheKey = `studentBehaviors:student:${deletedStudentBehavior.studentId}`;
    client.del(studentBehaviorCacheKey);
    client.del(studentBehaviorsCacheKey);

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

    const studentBehaviorsCacheKey = `studentBehaviors:student:${studentId}`;
    saveToCache(studentBehaviorsCacheKey, response);

    return response;
  } catch (error) {
    handlePrismaError(error, 'student behavior');
  }
};
