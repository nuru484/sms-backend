// src/repositories/academicCalendar/academic-calendar-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
/**
 * Repository function to create a single academic calendar entry.
 *
 * @param {Object} calendarData - Object containing academic calendar details.
 * @returns {Promise<Object>} - Returns the created academic calendar object if successful.
 * @throws {Error} - Throws an error if there's an issue during the creation process.
 */
export const createAcademicCalendar = async (calendarData) => {
  try {
    const academicCalendar = await prisma.academicCalendar.create({
      data: calendarData,
    });

    return academicCalendar;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to update an academic calendar entry by its ID.
 *
 * @param {number} calendarId - The ID of the academic calendar to be updated.
 * @param {Object} updateData - The data to update (e.g., { year: '2025/2026', metadata: {...} }).
 * @returns {Promise<Object>} - Returns the updated academic calendar object if successful.
 * @throws {Error} - Throws an error if the academic calendar is not found or there's a database issue.
 */
export const updateAcademicCalendarById = async (calendarId, updateData) => {
  try {
    const updatedAcademicCalendar = await prisma.academicCalendar.update({
      where: { id: parseInt(calendarId, 10) },
      data: updateData,
    });

    return updatedAcademicCalendar;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single academic calendar entry by its ID.
 *
 * @param {number} calendarId - The ID of the academic calendar to fetch.
 * @returns {Promise<Object>} - Returns the academic calendar object if found.
 * @throws {Error} - Throws an error if the academic calendar is not found or there's a database issue.
 */
export const fetchAcademicCalendarById = async (calendarId) => {
  try {
    const academicCalendar = await prisma.academicCalendar.findUnique({
      where: { id: parseInt(calendarId, 10) },
    });

    return academicCalendar;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch academic calendars with pagination and optional search by year.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery).
 * @returns {Promise<Object>} - Returns an object containing the academic calendars and pagination info.
 */
export const fetchAcademicCalendars = async (options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    const searchFilters = {
      ...(searchQuery && {
        year: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
    };

    const total = await prisma.academicCalendar.count({
      where: searchFilters,
    });

    let academicCalendars;
    if (fetchAll) {
      academicCalendars = await prisma.academicCalendar.findMany({
        where: searchFilters,
        orderBy: {
          year: 'asc',
        },
      });
    } else {
      academicCalendars = await prisma.academicCalendar.findMany({
        where: searchFilters,
        skip,
        take: limit,
        orderBy: {
          year: 'asc',
        },
      });
    }

    return {
      data: academicCalendars,
      pagination: fetchAll
        ? null
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

/**
 * Repository function to delete a single academic calendar entry by ID.
 *
 * @param {number} calendarId - The ID of the academic calendar to delete.
 * @returns {Promise<Object>} - Returns the deleted academic calendar object.
 */
export const deleteAcademicCalendarById = async (calendarId) => {
  try {
    const academicCalendar = await prisma.academicCalendar.delete({
      where: { id: parseInt(calendarId, 10) },
    });
    return academicCalendar;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all academic calendar entries.
 *
 * @returns {Promise<number>} - Returns the count of deleted academic calendar entries.
 */
export const deleteAllAcademicCalendars = async () => {
  try {
    const response = await prisma.academicCalendar.deleteMany();

    return response.count;
  } catch (error) {
    throw error;
  }
};
