// src/repositories/users/teacher-repository.js
import prisma from '../../config/prismaClient.js';

export const getTeachers = async (options = {}) => {
  const { page = 1, limit = 10, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    const where = searchQuery
      ? {
          OR: [
            {
              user: {
                username: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            {
              user: {
                firstName: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            {
              user: {
                lastName: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            {
              user: {
                middleName: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            { user: { email: { contains: searchQuery, mode: 'insensitive' } } },
            {
              user: {
                phoneNumber: { contains: searchQuery, mode: 'insensitive' },
              },
            },
          ],
        }
      : {};

    const teachers = await prisma.teacher.findMany({
      skip,
      take: limit,
      where,
      include: {
        user: true,
      },
    });

    const totalTeachers = await prisma.teacher.count({ where });

    return {
      teachers,
      pagination: {
        totalTeachers,
        page,
        limit,
        totalPages: Math.ceil(totalTeachers / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getTeacherById = async (teacherId) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(teacherId, 10) },
      include: {
        user: true,
      },
    });

    return teacher;
  } catch (error) {
    throw error;
  }
};
