// src/repositories/term/term-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

/**
 * Repository function to create a single term entry.
 *
 * @param {Object} termData - Object containing term details, including academicCalendarId.
 * @returns {Promise<Object>} - Returns the created term object if successful.
 * @throws {Error} - Throws an error if there's an issue during the creation process.
 */
export const createTerm = async (termData) => {
  try {
    const { academicCalendarId, ...rest } = termData;

    const term = await prisma.term.create({
      data: {
        ...rest,
        academicCalendar: {
          connect: { id: parseInt(academicCalendarId, 10) },
        },
      },
    });

    return term;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to update a term entry by its ID.
 *
 * @param {number} termId - The ID of the term to be updated.
 * @param {Object} updateData - The data to update (e.g., { name: 'Spring', metadata: {...} }).
 * @returns {Promise<Object>} - Returns the updated term object if successful.
 * @throws {Error} - Throws an error if the term is not found or there's a database issue.
 */
export const updateTermById = async (termId, updateData) => {
  try {
    const updatedTerm = await prisma.term.update({
      where: { id: parseInt(termId, 10) },
      data: updateData,
    });

    return updatedTerm;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single term entry by its ID.
 *
 * @param {number} termId - The ID of the term to fetch.
 * @returns {Promise<Object>} - Returns the term object if found.
 * @throws {Error} - Throws an error if the term is not found or there's a database issue.
 */
export const fetchTermById = async (termId) => {
  try {
    const term = await prisma.term.findUnique({
      where: { id: parseInt(termId, 10) },
      include: { academicCalendar: true },
    });

    return term;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch terms with pagination and optional search by name.
 *
 * @param {Object} options - Query parameters (page, limit, searchQuery, academicCalendarId).
 * @returns {Promise<Object>} - Returns an object containing the terms and pagination info.
 */
export const fetchTerms = async (options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    const searchFilters = {
      ...(searchQuery && {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      }),
    };

    const total = await prisma.term.count({
      where: searchFilters,
    });

    let terms;
    if (fetchAll) {
      terms = await prisma.term.findMany({
        where: searchFilters,
        include: { academicCalendar: true },
        orderBy: {
          startDate: 'asc',
        },
      });
    } else {
      terms = await prisma.term.findMany({
        where: searchFilters,
        skip,
        take: limit,
        include: { academicCalendar: true },
        orderBy: {
          startDate: 'asc',
        },
      });
    }

    return {
      data: terms,
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
 * Repository function to delete a single term entry by ID.
 *
 * @param {number} termId - The ID of the term to delete.
 * @returns {Promise<Object>} - Returns the deleted term object.
 */
export const deleteTermById = async (termId) => {
  try {
    const term = await prisma.term.delete({
      where: { id: parseInt(termId, 10) },
    });

    return term;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all terms.
 *
 * @returns {Promise<number>} - Returns the count of deleted term entries.
 */
export const deleteAllTerms = async () => {
  try {
    const response = await prisma.term.deleteMany();

    return response.count;
  } catch (error) {
    throw error;
  }
};
