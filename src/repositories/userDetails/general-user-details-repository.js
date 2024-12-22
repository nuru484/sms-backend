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
      include: {
        user: true,
        StudentApplicationNumber: true,
      },
    });

    const totalUsers = await prisma[entity].count({ where });

    return {
      users,
      totalStudents,
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

export const getUserAddress = async (userId) => {
  try {
    const address = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        address: true, // Fetch the student's address
      },
    });

    return address;
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

export const getUserHealthAndSafety = async (userId) => {
  try {
    const healthAndSafety = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        HealthAndSafety: true,
      },
    });

    return healthAndSafety;
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
