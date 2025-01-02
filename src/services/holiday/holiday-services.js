// src/services/holiday/holiday-services.js
import {
  createHoliday,
  updateHolidayById,
  fetchHolidayById,
  fetchHolidays,
  deleteHolidayById,
  deleteAllHolidays,
} from '../../repositories/holiday/holiday-repository.js';
import { fetchAcademicCalendarById } from '../../repositories/academicCalendar/academic-calendar-repository.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to create a single holiday entry.
 *
 * @param {Object} holidayData - Object containing holiday details.
 * @returns {Promise<Object>} - Returns the created holiday object.
 * @throws {CustomError} - Throws an error if the creation fails.
 */
export const processCreateHoliday = async (holidayData) => {
  try {
    const academicCalendar =
      holidayData.academicCalendarId &&
      (await fetchAcademicCalendarById(holidayData.academicCalendarId));

    if (!academicCalendar) {
      throw new CustomError(
        404,
        `Academic calendar with ID ${holidayData.academicCalendarId} not found.`
      );
    }

    const holiday = await createHoliday(holidayData);

    // Invalidate the cache for all holidays and related academic calendar
    const patterns = [
      `holidays:{*}`,
      `academicCalendar:${holiday.academicCalendarId}`,
    ];
    await invalidateCache(client, patterns);

    return holiday;
  } catch (error) {
    handlePrismaError(error, 'Holiday');
  }
};

/**
 * Service function to update a holiday entry by its ID.
 *
 * @param {number} holidayId - The ID of the holiday to update.
 * @param {Object} updateData - Object containing the fields to update.
 * @returns {Promise<Object>} - Returns the updated holiday object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const processUpdateHoliday = async (holidayId, updateData) => {
  try {
    const academicCalendar =
      updateData.academicCalendarId &&
      (await fetchAcademicCalendarById(updateData.academicCalendarId));

    if (!academicCalendar) {
      throw new CustomError(
        404,
        `Academic calendar with ID ${updateData.academicCalendarId} not found.`
      );
    }

    const updatedHoliday = await updateHolidayById(holidayId, updateData);

    // Invalidate the cache for this specific holiday and related academic calendar
    const patterns = [
      `holiday:${holidayId}`,
      `academicCalendar:${updatedHoliday.academicCalendarId}`,
      'holidays:{*}',
    ];
    await invalidateCache(client, patterns);

    return updatedHoliday;
  } catch (error) {
    handlePrismaError(error, 'Holiday');
  }
};

/**
 * Service function to fetch a single holiday entry by its ID.
 *
 * @param {number} holidayId - The ID of the holiday to fetch.
 * @returns {Promise<Object>} - Returns the holiday object.
 * @throws {CustomError} - Throws an error if the holiday is not found.
 */
export const processGetHolidayById = async (holidayId) => {
  try {
    const holiday = await fetchHolidayById(holidayId);

    if (!holiday) {
      throw new CustomError(404, `Holiday with ID ${holidayId} not found.`);
    }

    // Cache the holiday data
    const holidayCacheKey = `holiday:${holidayId}`;
    saveToCache(holidayCacheKey, { data: holiday });

    return holiday;
  } catch (error) {
    handlePrismaError(error, 'Holiday');
  }
};

/**
 * Service function to fetch holidays with pagination and optional search.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery, academicCalendarId).
 * @returns {Promise<Object>} - Returns an object containing holidays and pagination info.
 * @throws {CustomError} - Throws an error if no holidays are found.
 */
export const processGetHolidays = async (options) => {
  try {
    const response = await fetchHolidays(options);

    if (!response || response.data.length === 0) {
      throw new CustomError(404, `There are currently no holidays available.`);
    }

    // Cache the holidays data
    const holidaysCacheKey = `holidays:${JSON.stringify(options)}`;
    saveToCache(holidaysCacheKey, response);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Holiday');
  }
};

/**
 * Service function to delete a single holiday entry by its ID.
 *
 * @param {number} holidayId - The ID of the holiday to delete.
 * @returns {Promise<Object>} - Returns the deleted holiday object.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const processRemoveHolidayById = async (holidayId) => {
  try {
    const deletedHoliday = await deleteHolidayById(holidayId);

    // Invalidate the cache for this holiday and related academic calendar
    const patterns = [
      `holiday:${holidayId}`,
      `academicCalendar:${deletedHoliday.academicCalendarId}`,
      'holidays:{*}',
    ];
    await invalidateCache(client, patterns);

    return deletedHoliday;
  } catch (error) {
    handlePrismaError(error, 'Holiday');
  }
};

/**
 * Service function to delete all holiday entries.
 *
 * @returns {Promise<number>} - Returns the count of deleted holiday entries.
 * @throws {CustomError} - Throws an error if there are no entries to delete.
 */
export const processRemoveAllHolidays = async () => {
  try {
    const response = await deleteAllHolidays();

    if (!response || response === 0) {
      throw new CustomError(
        404,
        `There are currently no holidays available to delete.`
      );
    }

    // Invalidate the cache for all holidays
    const patterns = [`holiday:*`, 'holidays:{*}'];
    await invalidateCache(client, patterns);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Holiday');
  }
};
