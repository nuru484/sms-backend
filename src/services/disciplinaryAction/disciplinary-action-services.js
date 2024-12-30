// src/services/disciplinaryAction/disciplinary-action-services.js

import {
  createDisciplinaryAction,
  updateDisciplinaryAction,
  getDisciplinaryAction,
  deleteDisciplinaryAction,
  getStudentDisciplinaryActions,
} from '../../repositories/disciplinaryAction/disciplinary-action-repository.js';
import { getStudentById } from '../../repositories/users/student-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';
import prisma from '../../config/prismaClient.js';

/**
 * Service function to create a disciplinary action for a student.
 */
export const createDisciplinaryActionDetails = async (
  studentId,
  disciplinaryActionPayload
) => {
  try {
    const { studentBehaviorIds, ...disciplinaryActionData } =
      disciplinaryActionPayload;

    const student = await getStudentById(studentId);

    if (!student) {
      throw new CustomError(404, `Student with ID ${studentId} not found.`);
    }

    if (studentBehaviorIds && studentBehaviorIds.length > 0) {
      // Validate each behavior ID using Promise.all
      await Promise.all(
        studentBehaviorIds.map(async (behaviorId) => {
          const validBehavior = await prisma.studentBehavior.findUnique({
            where: { id: parseInt(behaviorId, 10) },
          });

          if (!validBehavior) {
            throw new CustomError(
              404,
              `Behavior with ID ${behaviorId} not found!`
            );
          }
        })
      );
    }

    const newDisciplinaryAction = await createDisciplinaryAction(
      studentId,
      disciplinaryActionData,
      studentBehaviorIds
    );

    const patterns = [`disciplinaryActions:student:${studentId}{*}`];
    await invalidateCache(client, patterns);

    return newDisciplinaryAction;
  } catch (error) {
    handlePrismaError(error, 'disciplinary action');
  }
};

/**
 * Service function to update a disciplinary action by ID.
 */
export const updateDisciplinaryActionDetails = async (
  disciplinaryActionId,
  disciplinaryActionData
) => {
  try {
    const disciplinaryAction = await getDisciplinaryAction(
      disciplinaryActionId
    );

    if (!disciplinaryAction) {
      throw new CustomError(
        404,
        `Disciplinary Action with ID ${disciplinaryActionId} not found.`
      );
    }

    const updatedDisciplinaryAction = await updateDisciplinaryAction(
      disciplinaryActionId,
      disciplinaryActionData
    );

    // Invalidate cache
    const patterns = [
      `disciplinaryAction:${disciplinaryActionId}`,
      `disciplinaryActions:student:${studentId}{*}`,
    ];
    await invalidateCache(client, patterns);

    return updatedDisciplinaryAction;
  } catch (error) {
    handlePrismaError(error, 'disciplinary action');
  }
};

/**
 * Service function to get a disciplinary action by ID.
 */
export const getDisciplinaryActionDetails = async (disciplinaryActionId) => {
  try {
    const disciplinaryAction = await getDisciplinaryAction(
      disciplinaryActionId
    );

    if (!disciplinaryAction) {
      throw new CustomError(
        404,
        `Disciplinary Action with ID ${disciplinaryActionId} not found.`
      );
    }

    const disciplinaryActionCacheKey = `disciplinaryAction:${disciplinaryActionId}`;
    saveToCache(disciplinaryActionCacheKey, disciplinaryAction);

    return disciplinaryAction;
  } catch (error) {
    handlePrismaError(error, 'disciplinary action');
  }
};

/**
 * Service function to delete a disciplinary action by ID.
 */
export const deleteDisciplinaryActionDetails = async (disciplinaryActionId) => {
  try {
    const deletedDisciplinaryAction = await deleteDisciplinaryAction(
      disciplinaryActionId
    );

    if (!deletedDisciplinaryAction) {
      throw new CustomError(
        404,
        `Disciplinary Action with ID ${disciplinaryActionId} not found.`
      );
    }

    const studentId = deletedDisciplinaryAction.studentId; // Get the student ID from the deleted disciplinary action record

    // Invalidate cache
    const patterns = [
      `disciplinaryAction:${disciplinaryActionId}`,
      `disciplinaryActions:student:${studentId}{*}`,
    ];
    await invalidateCache(client, patterns);

    return deletedDisciplinaryAction;
  } catch (error) {
    handlePrismaError(error, 'disciplinary action');
  }
};

// Service function
export const getStudentDisciplinaryActionsService = async (
  studentId,
  options = {}
) => {
  try {
    const response = await getStudentDisciplinaryActions(studentId, options);

    if (!response || response.disciplinaryActions.length === 0) {
      throw new CustomError(
        404,
        `There are no disciplinary actions for student ID ${studentId}.`
      );
    }

    const studentDisciplinaryActionsCacheKey = `disciplinaryActions:student:${studentId}${JSON.stringify(
      options
    )}`;
    saveToCache(studentDisciplinaryActionsCacheKey, response); // Save to cache

    return response;
  } catch (error) {
    handlePrismaError(error, 'disciplinary action');
  }
};
