// src/controllers/extraCurricularActivity/extra-curricular-activity-controller.js

import {
  createExtracurricularActivity,
  updateExtracurricularActivity,
  getExtracurricularActivity,
  deleteExtracurricularActivity,
  getStudentExtracurricularActivities,
} from '../../repositories/extraCurricularActivity/extra-curricular-activity-repository.js';
import { getStudentById } from '../../repositories/users/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

/**
 * Service function to create an extracurricular activity for a student.
 */
export const createExtracurricularActivityDetails = async (
  studentId,
  extracurricularActivityData
) => {
  try {
    const student = await getStudentById(studentId);

    if (!student) {
      throw new CustomError(404, `Student with ID ${studentId} not found.`);
    }

    const newExtracurricularActivity = await createExtracurricularActivity(
      studentId,
      extracurricularActivityData
    );

    return newExtracurricularActivity;
  } catch (error) {
    handlePrismaError(error, 'extracurricular activity');
  }
};

/**
 * Service function to update an extracurricular activity by ID.
 */
export const updateExtracurricularActivityDetails = async (
  extracurricularActivityId,
  extracurricularActivityData
) => {
  try {
    const extracurricularActivity = await getExtracurricularActivity(
      extracurricularActivityId
    );

    if (!extracurricularActivity) {
      throw new CustomError(
        404,
        `Extracurricular Activity with ID ${extracurricularActivityId} not found.`
      );
    }

    const updatedExtracurricularActivity = await updateExtracurricularActivity(
      extracurricularActivityId,
      extracurricularActivityData
    );

    return updatedExtracurricularActivity;
  } catch (error) {
    handlePrismaError(error, 'extracurricular activity');
  }
};

/**
 * Service function to get an extracurricular activity by ID.
 */
export const getExtracurricularActivityDetails = async (
  extracurricularActivityId
) => {
  try {
    const extracurricularActivity = await getExtracurricularActivity(
      extracurricularActivityId
    );

    if (!extracurricularActivity) {
      throw new CustomError(
        404,
        `Extracurricular Activity with ID ${extracurricularActivityId} not found.`
      );
    }

    return extracurricularActivity;
  } catch (error) {
    handlePrismaError(error, 'extracurricular activity');
  }
};

/**
 * Service function to delete an extracurricular activity by ID.
 */
export const deleteExtracurricularActivityDetails = async (
  extracurricularActivityId
) => {
  try {
    const deletedExtracurricularActivity = await deleteExtracurricularActivity(
      extracurricularActivityId
    );

    if (!deletedExtracurricularActivity) {
      throw new CustomError(
        404,
        `Extracurricular Activity with ID ${extracurricularActivityId} not found.`
      );
    }

    return deletedExtracurricularActivity;
  } catch (error) {
    handlePrismaError(error, 'extracurricular activity');
  }
};

/**
 * Service function to get extracurricular activities for a student with pagination and search filters.
 */
export const getAllStudentExtracurricularActivitiesService = async (
  studentId,
  options = {}
) => {
  try {
    const response = await getStudentExtracurricularActivities(
      studentId,
      options
    );

    if (!response || response.extracurricularActivities.length === 0) {
      throw new CustomError(
        404,
        `There are no extracurricular activities for student ID ${studentId}.`
      );
    }

    return response;
  } catch (error) {
    handlePrismaError(error, 'extracurricular activity');
  }
};
