// src/repositories/term/term-repository.js
import prisma from '../../config/prismaClient.js';

/**
 * Repository function to create a single term in the database.
 */
export const createTerm = async (termDetails) => {
  try {
    // Create the term record in the database using Prisma
    const term = await prisma.term.create({
      data: termDetails,
    });

    return term; // Return the created term object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

/**
 * Repository function to update a term by its ID in the database.
 *  */
export const updateTermById = async (termId, updateData) => {
  try {
    // Attempt to update the term in the database
    const updatedTerm = await prisma.term.update({
      where: { id: parseInt(termId) },
      data: updateData,
    });

    return updatedTerm; // Return the updated term object
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single term by its ID.
 */
export const fetchTermById = async (termId) => {
  try {
    // Fetch the term by ID
    const term = await prisma.term.findUnique({
      where: { id: parseInt(termId) },
    });

    return term;
  } catch (error) {
    // Re-throw the error to be handled by the error handler middleware
    throw error;
  }
};

/**
 * Repository function to fetch terms with pagination and optional search by name, start, end, or year.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns an object containing the terms and pagination info.
 */
export const fetchTerms = async (options) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    // Parse the search query to check if it's a valid date
    const searchDate = new Date(searchQuery);
    const isDate = !isNaN(searchDate);

    // Build the search filters dynamically
    const searchFilters = searchQuery
      ? {
          OR: [
            {
              name: {
                contains: searchQuery,
                mode: 'insensitive', // Case-insensitive search
              },
            },
            isDate && {
              start: searchDate,
            },
            isDate && {
              end: searchDate,
            },
            isDate && {
              year: searchDate,
            },
          ].filter(Boolean), // Remove falsy conditions
        }
      : {};

    // Fetch the total number of terms that match the search criteria
    const total = await prisma.term.count({
      where: searchFilters,
    });

    let terms;
    if (fetchAll) {
      // Fetch all terms without pagination
      terms = await prisma.term.findMany({
        where: searchFilters,
        orderBy: {
          createdAt: 'desc', // Optional: order by creation date
        },
      });
    } else {
      // Fetch the terms with pagination
      terms = await prisma.term.findMany({
        where: searchFilters,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc', // Optional: order by creation date
        },
      });
    }

    return {
      terms,
      pagination: {
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
 * Repository function to delete a single term by ID.
 */
export const deleteTermById = async (termId) => {
  try {
    const term = await prisma.term.delete({
      where: { id: parseInt(termId) },
    });

    return term;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all terms.
 */
export const deleteAllTerms = async () => {
  try {
    const deletedCount = await prisma.term.deleteMany();

    return deletedCount.count;
  } catch (error) {
    throw error;
  }
};
