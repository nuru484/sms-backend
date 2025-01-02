// src/services/term/term-services.js
import {
  createTerm,
  updateTermById,
  fetchTermById,
  fetchTerms,
  deleteTermById,
  deleteAllTerms,
} from '../../repositories/term/term-repository.js';
import { fetchAcademicCalendarById } from '../../repositories/academicCalendar/academic-calendar-repository.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to create a single term entry.
 *
 * @param {Object} termData - Object containing term details.
 * @returns {Promise<Object>} - Returns the created term object.
 * @throws {CustomError} - Throws an error if the creation fails.
 */
export const processCreateTerm = async (termData) => {
  try {
    const academicCalendar =
      termData.academicCalendarId &&
      (await fetchAcademicCalendarById(termData.academicCalendarId));

    if (!academicCalendar) {
      throw new CustomError(
        404,
        `Academic calendar with ID ${termData.academicCalendarId} not found.`
      );
    }

    const term = await createTerm(termData);

    // Invalidate the cache for all terms and related academic calendar
    const patterns = [
      `terms:{*}`,
      `academicCalendar:${term.academicCalendarId}`,
    ];
    await invalidateCache(client, patterns);

    return term;
  } catch (error) {
    handlePrismaError(error, 'Term');
  }
};

/**
 * Service function to update a term entry by its ID.
 *
 * @param {number} termId - The ID of the term to update.
 * @param {Object} updateData - Object containing the fields to update.
 * @returns {Promise<Object>} - Returns the updated term object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const processUpdateTerm = async (termId, updateData) => {
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

    const updatedTerm = await updateTermById(termId, updateData);

    // Invalidate the cache for this specific term and related academic calendar
    const patterns = [
      `term:${termId}`,
      `academicCalendar:${updatedTerm.academicCalendarId}`,
      'terms:{*}',
    ];
    await invalidateCache(client, patterns);

    return updatedTerm;
  } catch (error) {
    handlePrismaError(error, 'Term');
  }
};

/**
 * Service function to fetch a single term entry by its ID.
 *
 * @param {number} termId - The ID of the term to fetch.
 * @returns {Promise<Object>} - Returns the term object.
 * @throws {CustomError} - Throws an error if the term is not found.
 */
export const processGetTermById = async (termId) => {
  try {
    const term = await fetchTermById(termId);

    if (!term) {
      throw new CustomError(404, `Term with ID ${termId} not found.`);
    }

    // Cache the term data
    const termCacheKey = `term:${termId}`;
    saveToCache(termCacheKey, { data: term });

    return term;
  } catch (error) {
    handlePrismaError(error, 'Term');
  }
};

/**
 * Service function to fetch terms with pagination and optional search.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery, academicCalendarId).
 * @returns {Promise<Object>} - Returns an object containing terms and pagination info.
 * @throws {CustomError} - Throws an error if no terms are found.
 */
export const processGetTerms = async (options) => {
  try {
    const response = await fetchTerms(options);

    if (!response || response.data.length === 0) {
      throw new CustomError(404, `There are currently no terms available.`);
    }

    // Cache the terms data
    const termsCacheKey = `terms:${JSON.stringify(options)}`;
    saveToCache(termsCacheKey, response);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Term');
  }
};

/**
 * Service function to delete a single term entry by its ID.
 *
 * @param {number} termId - The ID of the term to delete.
 * @returns {Promise<Object>} - Returns the deleted term object.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const processRemoveTermById = async (termId) => {
  try {
    const deletedTerm = await deleteTermById(termId);

    // Invalidate the cache for this term and related academic calendar
    const patterns = [
      `term:${termId}`,
      `academicCalendar:${deletedTerm.academicCalendarId}`,
      'terms:{*}',
    ];
    await invalidateCache(client, patterns);

    return deletedTerm;
  } catch (error) {
    handlePrismaError(error, 'Term');
  }
};

/**
 * Service function to delete all term entries.
 *
 * @returns {Promise<number>} - Returns the count of deleted term entries.
 * @throws {CustomError} - Throws an error if there are no entries to delete.
 */
export const processRemoveAllTerms = async () => {
  try {
    const response = await deleteAllTerms();

    if (!response || response === 0) {
      throw new CustomError(
        404,
        `There are currently no terms available to delete.`
      );
    }

    // Invalidate the cache for all terms
    const patterns = [`term:*`, 'terms:{*}'];
    await invalidateCache(client, patterns);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Term');
  }
};
