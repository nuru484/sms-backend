// src/services/academicCalendar/academic-calendar-services.js
import {
  createAcademicCalendar,
  updateAcademicCalendarById,
  fetchAcademicCalendarById,
  fetchAcademicCalendars,
  deleteAcademicCalendarById,
  deleteAllAcademicCalendars,
} from '../../repositories/academicCalendar/academic-calendar-repository.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to create a single academic calendar entry.
 *
 * @param {Object} calendarData - Object containing academic calendar details.
 * @returns {Promise<Object>} - Returns the created academic calendar object.
 * @throws {CustomError} - Throws an error if the creation fails.
 */
export const processCreateAcademicCalendar = async (calendarData) => {
  try {
    const academicCalendar = await createAcademicCalendar(calendarData);

    // Invalidate the cache for all academic calendars
    const patterns = ['academicCalendars:{*}'];
    await invalidateCache(client, patterns);

    return academicCalendar;
  } catch (error) {
    handlePrismaError(error, 'Academic Calendar');
  }
};

/**
 * Service function to update an academic calendar entry by its ID.
 *
 * @param {number} calendarId - The ID of the academic calendar to update.
 * @param {Object} updateData - Object containing the fields to update.
 * @returns {Promise<Object>} - Returns the updated academic calendar object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const processUpdateAcademicCalendar = async (calendarId, updateData) => {
  try {
    const updatedAcademicCalendar = await updateAcademicCalendarById(
      calendarId,
      updateData
    );

    // Invalidate the cache for this specific academic calendar and all academic calendars
    const patterns = [
      `academicCalendar:${calendarId}`,
      'academicCalendars:{*}',
    ];
    await invalidateCache(client, patterns);

    return updatedAcademicCalendar;
  } catch (error) {
    handlePrismaError(error, 'Academic Calendar');
  }
};

/**
 * Service function to fetch a single academic calendar entry by its ID.
 *
 * @param {number} calendarId - The ID of the academic calendar to fetch.
 * @returns {Promise<Object>} - Returns the academic calendar object.
 * @throws {CustomError} - Throws an error if the academic calendar is not found.
 */
export const processGetAcademicCalendarById = async (calendarId) => {
  try {
    const academicCalendar = await fetchAcademicCalendarById(calendarId);

    if (!academicCalendar) {
      throw new CustomError(
        404,
        `Academic calendar with ID ${calendarId} not found.`
      );
    }

    // Cache the academic calendar data
    const calendarCacheKey = `academicCalendar:${calendarId}`;
    saveToCache(calendarCacheKey, { data: academicCalendar });

    return academicCalendar;
  } catch (error) {
    handlePrismaError(error, 'Academic Calendar');
  }
};

/**
 * Service function to fetch academic calendars with pagination and optional search.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery).
 * @returns {Promise<Object>} - Returns an object containing academic calendars and pagination info.
 * @throws {CustomError} - Throws an error if no academic calendars are found.
 */
export const processGetAcademicCalendars = async (options) => {
  try {
    const response = await fetchAcademicCalendars(options);

    if (!response || response.data.length === 0) {
      throw new CustomError(
        404,
        `There are currently no academic calendars available.`
      );
    }

    // Cache the academic calendars data
    const calendarsCacheKey = `academicCalendars:${JSON.stringify(options)}`;
    saveToCache(calendarsCacheKey, response);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Academic Calendar');
  }
};

/**
 * Service function to delete a single academic calendar entry by its ID.
 *
 * @param {number} calendarId - The ID of the academic calendar to delete.
 * @returns {Promise<Object>} - Returns the deleted academic calendar object.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const processRemoveAcademicCalendarById = async (calendarId) => {
  try {
    const patterns = [
      `academicCalendar:${calendarId}`,
      'academicCalendars:{*}',
    ];
    await invalidateCache(client, patterns);

    return await deleteAcademicCalendarById(calendarId);
  } catch (error) {
    handlePrismaError(error, 'Academic Calendar');
  }
};

/**
 * Service function to delete all academic calendar entries.
 *
 * @returns {Promise<number>} - Returns the count of deleted academic calendar entries.
 * @throws {CustomError} - Throws an error if there are no entries to delete.
 */
export const processRemoveAllAcademicCalendars = async () => {
  try {
    const response = await deleteAllAcademicCalendars();

    if (!response || response === 0) {
      throw new CustomError(
        404,
        `There are currently no academic calendars available to delete.`
      );
    }

    // Invalidate the cache for all academic calendars
    const patterns = [`academicCalendar:*`, 'academicCalendars:{*}'];
    await invalidateCache(client, patterns);

    return response;
  } catch (error) {
    handlePrismaError(error, 'AcademicCalendar');
  }
};
