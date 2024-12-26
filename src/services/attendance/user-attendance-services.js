// src/services/attendance/attendance-services.js

import * as turf from '@turf/turf';
import {
  createUserAttendance,
  updateUserAttendance,
  getUserAttendance,
  deleteUserAttendance,
  getUserAllAttendance,
} from '../../repositories/attendance/user-attendance-repository.js';
import { getUserById } from '../../repositories/users/general-user-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import prisma from '../../config/prismaClient.js';
import { saveToCache, client } from '../../config/redis.js';

/**
 * Service function to create attendance for a user.
 */

export const createAttendanceDetails = async (
  userId,
  attendanceData,
  recorderId = null
) => {
  try {
    // Validate recorder if provided
    if (recorderId) {
      const recorder = await getUserById(recorderId);
      if (!recorder) {
        throw new CustomError(404, `Recorder with ID ${recorderId} not found.`);
      }
    }

    // Validate user
    const user = await getUserById(userId);
    if (!user) {
      throw new CustomError(404, `User with ID ${userId} not found.`);
    }

    // Get today's date with the time set to 00:00:00 for the start of the day (inclusive)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set time to 00:00:00

    // Get today's date with the time set to 23:59:59 for the end of the day (inclusive)
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    // Check if the user has already clocked in today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: parseInt(userId),
        date: {
          gte: todayStart, // Greater than or equal to the start of today
          lt: todayEnd, // Less than the end of today (23:59:59.999)
        },
      },
    });

    if (existingAttendance) {
      throw new CustomError(409, 'User has already clocked in today.');
    }

    // Validate attendance data for TEACHER and STAFF roles
    if (user.role === 'TEACHER' || user.role === 'STAFF') {
      const userLocation = turf.point([
        attendanceData.longitude,
        attendanceData.latitude,
      ]);
      const geofenceCenter = turf.point([78.9012, 12.3456]); // Center of school
      const maxDistance = 100; // Radius in meters

      const isInside =
        turf.distance(userLocation, geofenceCenter, { units: 'meters' }) <=
        maxDistance;

      if (!isInside) {
        throw new CustomError(
          400,
          'You must be at the school premises to log attendance.'
        );
      }
    }

    // Create attendance record
    const newAttendance = await createUserAttendance(
      userId,
      attendanceData,
      recorderId
    );

    const userAllAttendanceCacheKey = `allAttendanceOfUser:${userId}`;
    client.del(userAllAttendanceCacheKey); // Invalidate the cache

    return newAttendance;
  } catch (error) {
    handlePrismaError(error, 'attendance');
  }
};

/**
 * Service function to update attendance details for a user.
 */
export const updateAttendanceDetails = async (
  attendanceId,
  attendanceData,
  recorderId = null
) => {
  try {
    // Validate recorder if provided
    if (recorderId) {
      const recorder = await getUserById(recorderId);
      if (!recorder) {
        throw new CustomError(404, `Recorder with ID ${recorderId} not found.`);
      }
    }

    // Validate attendance record existence
    const attendance = await getUserAttendance(attendanceId);
    if (!attendance) {
      throw new CustomError(
        404,
        `Attendance record with ID ${attendanceId} not found.`
      );
    }

    const updatedAttendance = await updateUserAttendance(
      attendanceId,
      attendanceData,
      recorderId
    );

    const userAttendanceCacheKey = `attendance:${attendanceId}`;
    const userAllAttendanceCacheKey = `allAttendanceOfUser:${attendance.userId}`;

    // Invalidate the cache
    await client.del(userAttendanceCacheKey);
    await client.del(userAllAttendanceCacheKey);

    return updatedAttendance;
  } catch (error) {
    handlePrismaError(error, 'attendance');
  }
};

/**
 * Service function to get attendance details by ID.
 */
export const getAttendanceDetails = async (attendanceId) => {
  try {
    const attendance = await getUserAttendance(attendanceId);

    if (!attendance) {
      throw new CustomError(
        404,
        `Attendance record with ID ${attendanceId} not found.`
      );
    }

    // Cache key generator
    const userAttendanceCacheKey = `attendance:${attendanceId}`;
    saveToCache(userAttendanceCacheKey, attendance); // Save to cache

    return attendance;
  } catch (error) {
    handlePrismaError(error, 'attendance');
  }
};

/**
 * Service function to delete attendance details by ID.
 */
export const deleteAttendanceDetails = async (attendanceId) => {
  try {
    const deletedAttendance = await deleteUserAttendance(attendanceId);

    if (!deletedAttendance) {
      throw new CustomError(
        404,
        `Attendance record with ID ${attendanceId} not found.`
      );
    }

    const userAttendanceCacheKey = `attendance:${attendanceId}`;
    const userAllAttendanceCacheKey = `allAttendanceOfUser:${deletedAttendance.userId}`;

    // Invalidate the cache
    await client.del(userAttendanceCacheKey);
    await client.del(userAllAttendanceCacheKey);

    return deletedAttendance;
  } catch (error) {
    handlePrismaError(error, 'attendance');
  }
};

/**
 * Service function to get all attendance records for a user.
 */
export const getUserAllAttendanceService = async (userId, options = {}) => {
  try {
    const response = await getUserAllAttendance(userId, options);

    if (!response || response.attendance.length === 0) {
      throw new CustomError(
        404,
        `There are no attendance records for user ID ${userId}.`
      );
    }

    // Cache key generator
    const userAllAttendanceCacheKey = `allAttendanceOfUser:${userId}`;
    saveToCache(userAllAttendanceCacheKey, response); // Save to cache

    return response;
  } catch (error) {
    handlePrismaError(error, 'attendance');
  }
};
