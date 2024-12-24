// src/repositories/attendance/attendance-repository.js

import prisma from '../../config/prismaClient.js';

// Create User Attendance
export const createUserAttendance = async (
  userId,
  attendanceData,
  recorderId = null
) => {
  try {
    const newAttendance = await prisma.attendance.create({
      data: {
        ...attendanceData,
        user: {
          connect: { id: parseInt(userId) },
        },
        ...(recorderId && {
          recorder: {
            connect: { id: parseInt(recorderId) },
          },
        }),
      },
    });

    return newAttendance;
  } catch (error) {
    throw error;
  }
};

// Update User Attendance
export const updateUserAttendance = async (
  attendanceId,
  attendanceData,
  recorderId = null
) => {
  try {
    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(attendanceId) },
      data: {
        ...attendanceData,
        ...(recorderId && {
          recorder: {
            connect: { id: parseInt(recorderId) },
          },
        }),
      },
    });

    return updatedAttendance;
  } catch (error) {
    throw error;
  }
};

// Get a Single User Attendance
export const getUserAttendance = async (attendanceId) => {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(attendanceId) },
    });

    return attendance;
  } catch (error) {
    throw error;
  }
};

// Delete User Attendance
export const deleteUserAttendance = async (attendanceId) => {
  try {
    const deletedAttendance = await prisma.attendance.delete({
      where: { id: parseInt(attendanceId) },
    });

    return deletedAttendance;
  } catch (error) {
    throw error;
  }
};

// Get All User Attendances
export const getUserAllAttendance = async (userId, options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    // Prepare search filters based on the searchQuery
    const searchFilters = {
      userId: parseInt(userId),
      ...(searchQuery && {
        OR: [
          {
            absenceReason: {
              contains: searchQuery,
              mode: 'insensitive', // Case insensitive match
            },
          },
          {
            location: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    // Fetch total count
    const total = await prisma.attendance.count({
      where: searchFilters,
    });

    let attendance;
    if (fetchAll) {
      // Fetch all records if fetchAll is true
      attendance = await prisma.attendance.findMany({
        where: searchFilters,
      });
    } else {
      // Fetch paginated results
      attendance = await prisma.attendance.findMany({
        where: searchFilters,
        skip,
        take: limit,
      });
    }

    return {
      attendance,
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
