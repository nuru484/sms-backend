// src/repositories/users/student-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

export const getStudents = async (options = {}) => {
  const { page = 1, limit = 10, search = '' } = options;

  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { user: { username: { contains: search, mode: 'insensitive' } } },
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { user: { lastName: { contains: search, mode: 'insensitive' } } },
            { user: { middleName: { contains: search, mode: 'insensitive' } } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const students = await prisma.student.findMany({
      skip,
      take: limit,
      where,
      include: {
        user: true,
      },
    });

    const totalStudents = await prisma.student.count({ where });

    return {
      students,
      pagination: {
        totalStudents,
        page,
        limit,
        totalPages: Math.ceil(totalStudents / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId, 10) },
      include: {
        user: true,
        StudentApplicationNumber: true,
      },
    });

    return student;
  } catch (error) {
    throw error;
  }
};
