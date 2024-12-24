// src/repositories/studentBehavior/student-behavior-repository.js
import prisma from '../../config/prismaClient.js';

// Create Student Behavior
export const createStudentBehavior = async (
  studentId,
  reporterId,
  behaviorData
) => {
  try {
    const newStudentBehavior = await prisma.studentBehavior.create({
      data: {
        ...behaviorData,
        student: {
          connect: { id: parseInt(studentId) },
        },
        reporter: {
          connect: { id: parseInt(reporterId) },
        },
      },
    });

    return newStudentBehavior;
  } catch (error) {
    throw error;
  }
};

// Update Student Behavior
export const updateStudentBehavior = async (behaviorId, behaviorData) => {
  try {
    const updatedStudentBehavior = await prisma.studentBehavior.update({
      where: { id: parseInt(behaviorId) },
      data: behaviorData,
    });

    return updatedStudentBehavior;
  } catch (error) {
    throw error;
  }
};

// Get Student Behavior
export const getStudentBehavior = async (behaviorId) => {
  try {
    const studentBehavior = await prisma.studentBehavior.findUnique({
      where: { id: parseInt(behaviorId) },
    });

    return studentBehavior;
  } catch (error) {
    throw error;
  }
};

// Delete Student Behavior
export const deleteStudentBehavior = async (behaviorId) => {
  try {
    const deletedStudentBehavior = await prisma.studentBehavior.delete({
      where: { id: parseInt(behaviorId) },
    });

    return deletedStudentBehavior;
  } catch (error) {
    throw error;
  }
};

// Get All Student Behaviors
export const getStudentBehaviors = async (studentId, options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    // Parse and structure the search filters
    const searchFilters = {
      studentId: parseInt(studentId),
      ...(searchQuery && {
        OR: [
          {
            behaviorType: {
              contains: searchQuery,
              mode: 'insensitive', // Case insensitive match
            },
          },
          {
            behavior: {
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
        ],
      }),
    };

    // Fetch the total number of matching records
    const total = await prisma.studentBehavior.count({
      where: searchFilters,
    });

    let studentBehaviors;
    if (fetchAll) {
      // Fetch all records without pagination
      studentBehaviors = await prisma.studentBehavior.findMany({
        where: searchFilters,
        orderBy: {
          behaviorDate: 'desc',
        },
      });
    } else {
      // Paginate results
      const skip = (page - 1) * limit;
      studentBehaviors = await prisma.studentBehavior.findMany({
        where: searchFilters,
        skip,
        take: limit,
        orderBy: {
          behaviorDate: 'desc',
        },
      });
    }

    return {
      studentBehaviors,
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
