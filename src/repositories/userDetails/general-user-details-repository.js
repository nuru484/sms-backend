// src/repositories/userDetails/general-user-details.js
import prisma from '../../config/prismaClient.js';

export const getUsers = async ({
  entity,
  page = 1,
  pageSize = 10,
  search = '',
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

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

    const users = await prisma[entity].findMany({
      skip,
      take,
      where,
      include:
        entity === 'student'
          ? {
              user: true,
              StudentApplicationNumber: true,
            }
          : {
              user: true,
            },
    });

    const totalUsers = await prisma[entity].count({ where });

    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    return deletedUser;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all users from the database.
 *
 * @returns {Promise<number>} - Returns the count of deleted users if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with user deletion.
 */
export const deleteAllUsers = async () => {
  try {
    const result = await prisma.user.deleteMany({});

    return result.count;
  } catch (error) {
    throw error;
  }
};

export const getUserAttendance = async (userId) => {
  try {
    const attendance = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        Attendance: true,
      },
    });

    return attendance;
  } catch (error) {
    throw error;
  }
};

export const getUserEventParticipation = async (userId) => {
  try {
    const eventParticipants = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        EventParticipant: true,
      },
    });

    return eventParticipants;
  } catch (error) {
    throw error;
  }
};

export const getUserPosition = async (userId) => {
  try {
    const eventParticipants = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        Position: true,
      },
    });

    return eventParticipants;
  } catch (error) {
    throw error;
  }
};
