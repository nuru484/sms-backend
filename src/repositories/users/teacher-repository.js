import prisma from '../../config/prismaClient.js';

export const getTeachers = async (options = {}) => {
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
            {
              user: { phoneNumber: { contains: search, mode: 'insensitive' } },
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

console.log(
  JSON.stringify(await getTeachers({ search: '+1234567890' }), null, 2)
);
