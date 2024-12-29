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
          connect: { id: parseInt(studentId, 10) },
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
      where: { id: parseInt(disciplinaryActionId, 10) },
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
      where: { id: parseInt(disciplinaryActionId, 10) },
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
      where: { id: parseInt(disciplinaryActionId, 10) },
    });

    return deletedDisciplinaryAction;
  } catch (error) {
    throw error;
  }
};

export const getStudentDisciplinaryActions = async (
  studentId,
  options = {}
) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    // Parse and structure the search filters
    const searchFilters = {
      studentId: parseInt(studentId),
      ...(searchQuery && {
        OR: [
          {
            action: {
              contains: searchQuery,
              mode: 'insensitive', // Case insensitive match
            },
          },
          {
            reason: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            status: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            remarks: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    // Fetch the total number of matching records
    const total = await prisma.disciplinaryAction.count({
      where: searchFilters,
    });

    let disciplinaryActions;
    if (fetchAll) {
      // Fetch all records without pagination
      disciplinaryActions = await prisma.disciplinaryAction.findMany({
        where: searchFilters,
        orderBy: {
          date: 'desc', // Changed to 'date' if 'createdAt' is unavailable
        },
      });
    } else {
      // Paginate results
      const skip = (page - 1) * limit;
      disciplinaryActions = await prisma.disciplinaryAction.findMany({
        where: searchFilters,
        skip,
        take: limit,
        orderBy: {
          date: 'desc', // Changed to 'date' for pagination
        },
      });
    }

    return {
      disciplinaryActions,
      pagination: fetchAll
        ? null // No pagination info if fetching all records
        : {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
    };
  } catch (error) {
    throw error;
  }
};
