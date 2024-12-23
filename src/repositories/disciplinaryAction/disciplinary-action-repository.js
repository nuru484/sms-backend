// src/repositories/disciplinaryAction/disciplinary-action-repository.js
import prisma from '../../config/prismaClient.js';

// Create Disciplinary Action
export const createDisciplinaryAction = async (
  studentId,
  disciplinaryActionData
) => {
  try {
    const newDisciplinaryAction = await prisma.disciplinaryAction.create({
      data: {
        ...disciplinaryActionData,
        student: {
          connect: { id: parseInt(studentId) },
        },
      },
    });

    return newDisciplinaryAction;
  } catch (error) {
    throw error;
  }
};

// Update Disciplinary Action
export const updateDisciplinaryAction = async (
  disciplinaryActionId,
  disciplinaryActionData
) => {
  try {
    const updatedDisciplinaryAction = await prisma.disciplinaryAction.update({
      where: { id: parseInt(disciplinaryActionId) },
      data: disciplinaryActionData,
    });

    return updatedDisciplinaryAction;
  } catch (error) {
    throw error;
  }
};

// Get Disciplinary Action
export const getDisciplinaryAction = async (disciplinaryActionId) => {
  try {
    const disciplinaryAction = await prisma.disciplinaryAction.findUnique({
      where: { id: parseInt(disciplinaryActionId) },
    });

    return disciplinaryAction;
  } catch (error) {
    throw error;
  }
};

// Delete Disciplinary Action
export const deleteDisciplinaryAction = async (disciplinaryActionId) => {
  try {
    const deletedDisciplinaryAction = await prisma.disciplinaryAction.delete({
      where: { id: parseInt(disciplinaryActionId) },
    });

    return deletedDisciplinaryAction;
  } catch (error) {
    throw error;
  }
};

// Repository function
export const getStudentDisciplinaryActions = async (
  studentId,
  options = {}
) => {
  const { page = 1, limit = 10, fetchAll = false } = options;

  try {
    if (fetchAll) {
      // Fetch all disciplinary actions without pagination
      return await prisma.disciplinaryAction.findMany({
        where: { studentId: parseInt(studentId) },
      });
    }

    // Paginate results
    const skip = (page - 1) * limit;
    return await prisma.disciplinaryAction.findMany({
      where: { studentId: parseInt(studentId) },
      skip,
      take: limit,
    });
  } catch (error) {
    throw error;
  }
};
