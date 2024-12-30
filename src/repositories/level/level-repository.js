// src/repositories/level/level-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

/**
 * Repository function to create a single level in the database.
 *
 * @param {Object} levelData - Object containing level details like name, code, etc.
 * @returns {Promise<Object>} - Returns the created level object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createLevel = async (levelData) => {
  try {
    // Create the level record in the database using Prisma
    const level = await prisma.level.create({
      data: levelData,
    });

    return level; // Return the created level object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

/**
 * Repository function to update a level by its ID in the database.
 *
 * @param {number} id - The ID of the level to be updated.
 * @param {Object} updateData - The data to update (e.g., { name: 'New Name', code: 'NEW123' }).
 * @returns {Promise<Object>} - Returns the updated level object if successful.
 * @throws {CustomError} - Throws a custom error if the level is not found or if there is a database error.
 */
export const updateLevelById = async (levelId, updateData) => {
  try {
    // Attempt to update the level in the database
    const updatedLevel = await prisma.level.update({
      where: { id: parseInt(levelId, 10) },
      data: updateData,
    });

    return updatedLevel; // Return the updated level object
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single level by its ID.
 *
 * @param {number} id - The ID of the level to fetch.
 * @returns {Promise<Object>} - Returns the level object if found.
 * @throws {CustomError} - Throws a custom error if the level is not found or there's a database error.
 */
export const fetchLevelById = async (levelId) => {
  try {
    // Fetch the level by ID
    const level = await prisma.level.findUnique({
      where: { id: parseInt(levelId, 10) },
    });

    return level;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch levels with pagination and optional search by name.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns an object containing the levels and pagination info.
 */
export const fetchLevels = async (options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    const skip = (page - 1) * limit;

    // Prepare search filters for name, code, description, and order
    const searchFilters = {
      ...(searchQuery && {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            code: {
              contains: searchQuery,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            order: {
              equals: isNaN(Number(searchQuery))
                ? undefined
                : Number(searchQuery), // If search is a valid number, match on 'order'
            },
          },
        ],
      }),
    };

    // Fetch total count of levels matching the filters
    const total = await prisma.level.count({
      where: searchFilters,
    });

    let levels;
    if (fetchAll) {
      // Fetch all levels without pagination
      levels = await prisma.level.findMany({
        where: searchFilters,
        orderBy: {
          order: 'asc', // Optional: order levels by 'order' field
        },
      });
    } else {
      // Fetch paginated levels with search filters
      levels = await prisma.level.findMany({
        where: searchFilters,
        skip,
        take: limit,
        orderBy: {
          order: 'asc', // Ensure levels are ordered by the 'order' field
        },
      });
    }

    return {
      levels,
      pagination: fetchAll
        ? null // No pagination info if fetching all levels
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
 * Repository function to delete a single level by ID.
 *
 * @param {number} id - The ID of the level to delete.
 * @returns {Promise<Object>} - Returns the deleted level object.
 */
export const deleteLevelById = async (levelId) => {
  try {
    const level = await prisma.level.delete({
      where: { id: parseInt(levelId, 10) },
    });

    return level;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all levels.
 *
 * @returns {Promise<number>} - Returns the count of deleted levels.
 */
export const deleteAllLevels = async () => {
  try {
    const response = await prisma.level.deleteMany();

    return response.count;
  } catch (error) {
    throw error;
  }
};
