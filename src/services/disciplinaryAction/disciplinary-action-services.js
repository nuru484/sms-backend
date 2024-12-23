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

/**
 * Service function to create a disciplinary action for a student.
 */
export const createDisciplinaryActionDetails = async (
  studentId,
  disciplinaryActionData
) => {
  try {
    const student = await getStudentById(studentId);

    if (!student) {
      throw new CustomError(404, `Student with ID ${studentId} not found.`);
    }

    const newDisciplinaryAction = await createDisciplinaryAction(
      studentId,
      disciplinaryActionData
    );

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

    return response;
  } catch (error) {
    handlePrismaError(error, 'disciplinary action');
  }
};
