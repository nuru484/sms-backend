// src/repositories/extraCurricularActivity/extra-curricular-activity-repository.js

import prisma from '../../config/prismaClient.js';

// Create Extracurricular Activity
export const createExtracurricularActivity = async (
  studentId,
  extracurricularActivityData
) => {
  try {
    const newExtracurricularActivity =
      await prisma.extracurricularActivity.create({
        data: {
          ...extracurricularActivityData,
          student: {
            connect: { id: parseInt(studentId) },
          },
        },
      });

    return newExtracurricularActivity;
  } catch (error) {
    throw error;
  }
};

// Update Extracurricular Activity
export const updateExtracurricularActivity = async (
  extracurricularActivityId,
  extracurricularActivityData
) => {
  try {
    const updatedExtracurricularActivity =
      await prisma.extracurricularActivity.update({
        where: { id: parseInt(extracurricularActivityId) },
        data: extracurricularActivityData,
      });

    return updatedExtracurricularActivity;
  } catch (error) {
    throw error;
  }
};

// Get Extracurricular Activity
export const getExtracurricularActivity = async (extracurricularActivityId) => {
  try {
    const extracurricularActivity =
      await prisma.extracurricularActivity.findUnique({
        where: { id: parseInt(extracurricularActivityId) },
      });

    return extracurricularActivity;
  } catch (error) {
    throw error;
  }
};

// Delete Extracurricular Activity
export const deleteExtracurricularActivity = async (
  extracurricularActivityId
) => {
  try {
    const deletedExtracurricularActivity =
      await prisma.extracurricularActivity.delete({
        where: { id: parseInt(extracurricularActivityId) },
      });

    return deletedExtracurricularActivity;
  } catch (error) {
    throw error;
  }
};

// Get Student's Extracurricular Activities with pagination and search filters
export const getStudentExtracurricularActivities = async (
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
            activityName: {
              contains: searchQuery,
              mode: 'insensitive', // Case insensitive match
            },
          },
          {
            position: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            achievements: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    // Fetch the total number of matching records
    const total = await prisma.extracurricularActivity.count({
      where: searchFilters,
    });

    let extracurricularActivities;
    if (fetchAll) {
      // Fetch all records without pagination
      extracurricularActivities = await prisma.extracurricularActivity.findMany(
        {
          where: searchFilters,
          orderBy: {
            startDate: 'desc', // Sorting by start date
          },
        }
      );
    } else {
      // Paginate results
      const skip = (page - 1) * limit;
      extracurricularActivities = await prisma.extracurricularActivity.findMany(
        {
          where: searchFilters,
          skip,
          take: limit,
          orderBy: {
            startDate: 'desc', // Sorting by start date
          },
        }
      );
    }

    return {
      extracurricularActivities,
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
