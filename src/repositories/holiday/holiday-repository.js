// src/repositories/holiday/holiday-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

/**
 * Repository function to create a single holiday entry.
 *
 * @param {Object} holidayData - Object containing holiday details, including academicCalendarId.
 * @returns {Promise<Object>} - Returns the created holiday object if successful.
 * @throws {Error} - Throws an error if there's an issue during the creation process.
 */
export const createHoliday = async (holidayData) => {
  try {
    const { academicCalendarId, ...rest } = holidayData;

    const holiday = await prisma.holiday.create({
      data: {
        ...rest,
        academicCalendar: {
          connect: { id: parseInt(academicCalendarId, 10) },
        },
      },
    });

    return holiday;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to update a holiday entry by its ID.
 *
 * @param {number} holidayId - The ID of the holiday to be updated.
 * @param {Object} updateData - The data to update (e.g., { name: 'Christmas', description: 'Holiday season' }).
 * @returns {Promise<Object>} - Returns the updated holiday object if successful.
 * @throws {Error} - Throws an error if the holiday is not found or there's a database issue.
 */
export const updateHolidayById = async (holidayId, updateData) => {
  try {
    const updatedHoliday = await prisma.holiday.update({
      where: { id: parseInt(holidayId, 10) },
      data: updateData,
    });

    return updatedHoliday;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single holiday entry by its ID.
 *
 * @param {number} holidayId - The ID of the holiday to fetch.
 * @returns {Promise<Object>} - Returns the holiday object if found.
 * @throws {Error} - Throws an error if the holiday is not found or there's a database issue.
 */
export const fetchHolidayById = async (holidayId) => {
  try {
    const holiday = await prisma.holiday.findUnique({
      where: { id: parseInt(holidayId, 10) },
      include: { academicCalendar: true },
    });

    return holiday;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch holidays with pagination and optional search by name.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery, academicCalendarId).
 * @returns {Promise<Object>} - Returns an object containing the holidays and pagination info.
 */
export const fetchHolidays = async (options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    const searchFilters = {
      ...(searchQuery && {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },

        description: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
    };

    const total = await prisma.holiday.count({
      where: searchFilters,
    });

    let holidays;
    if (fetchAll) {
      holidays = await prisma.holiday.findMany({
        where: searchFilters,
        include: { academicCalendar: true },
        orderBy: {
          date: 'asc',
        },
      });
    } else {
      holidays = await prisma.holiday.findMany({
        where: searchFilters,
        skip,
        take: limit,
        include: { academicCalendar: true },
        orderBy: {
          date: 'asc',
        },
      });
    }

    return {
      data: holidays,
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
 * Repository function to delete a single holiday entry by ID.
 *
 * @param {number} holidayId - The ID of the holiday to delete.
 * @returns {Promise<Object>} - Returns the deleted holiday object.
 */
export const deleteHolidayById = async (holidayId) => {
  try {
    const holiday = await prisma.holiday.delete({
      where: { id: parseInt(holidayId, 10) },
    });

    return holiday;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all holidays.
 *
 * @returns {Promise<number>} - Returns the count of deleted holiday entries.
 */
export const deleteAllHolidays = async () => {
  try {
    const response = await prisma.holiday.deleteMany();

    return response.count;
  } catch (error) {
    throw error;
  }
};
