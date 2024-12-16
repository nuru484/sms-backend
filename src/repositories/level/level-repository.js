// src/repositories/level/level-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

/**
 * Repository function to create a single level in the database.
 *
 * @param {Object} levelData - Object containing level details like name, code, etc.
 * @returns {Promise<Object>} - Returns the created level object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createLevel = async ({ name, code, description, order }) => {
  try {
    // Log the attempt to create a level in the database
    logger.info({
      'Attempting to create level in the database': {
        levelData: { name, code, description, order },
      },
    });

    // Create the level record in the database using Prisma
    const level = await prisma.level.create({
      data: { name, code, description, order },
    });

    // Log the successful creation of the level
    logger.info({
      'Level successfully created in the database.': {
        levelId: level.id,
      },
    });

    return level; // Return the created level object
  } catch (error) {
    // Log any errors encountered during the level creation process
    logger.error({
      'Database error during level creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate level details: ${error.meta?.target || error.message}`
      );
    }

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
export const updateLevelById = async (id, updateData) => {
  try {
    // Log the attempt to update the level
    logger.info({
      'Attempting to update level': {
        levelId: id,
        updateData,
      },
    });

    // Attempt to update the level in the database
    const updatedLevel = await prisma.level.update({
      where: { id },
      data: updateData,
    });

    // Log the successful update
    logger.info({
      'Level successfully updated': {
        levelId: updatedLevel.id,
        updatedFields: updateData,
      },
    });

    return updatedLevel; // Return the updated level object
  } catch (error) {
    // Handle the case where the level is not found
    if (error.code === 'P2025') {
      logger.warn({
        'Level not found during update': { levelId: id },
      });
      throw new CustomError(404, `Level with ID ${id} not found.`);
    }

    // Log unexpected errors and rethrow them as internal server errors
    logger.error({
      'Database error during level update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

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
export const fetchLevelById = async (id) => {
  try {
    // Fetch the level by ID
    const level = await prisma.level.findUnique({
      where: { id },
    });

    if (!level) {
      throw new CustomError(404, `Level with ID ${id} not found.`);
    }

    return level;
  } catch (error) {
    logger.error({
      'Error fetching level by ID': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};

/**
 * Repository function to fetch levels with pagination and optional search by name.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns an object containing the levels and pagination info.
 */
export const fetchLevels = async ({ page = 1, limit = 10, search = '' }) => {
  try {
    const skip = (page - 1) * limit;

    // Fetch the total number of levels
    const total = await prisma.level.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });

    // Fetch the levels with pagination and search
    const levels = await prisma.level.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
    });

    return {
      levels,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error({
      'Error fetching levels with pagination': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};

/**
 * Repository function to delete a single level by ID.
 *
 * @param {number} id - The ID of the level to delete.
 * @returns {Promise<Object>} - Returns the deleted level object.
 */
export const deleteLevelById = async (id) => {
  try {
    const level = await prisma.level.delete({
      where: { id },
    });

    return level;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new CustomError(404, `Level with ID ${id} not found.`);
    }

    logger.error({
      'Error deleting level by ID': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

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
    const deletedCount = await prisma.level.deleteMany();

    return deletedCount.count;
  } catch (error) {
    logger.error({
      'Error deleting all levels': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};
