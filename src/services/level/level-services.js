// src/services/level/level-creation-service.js

import {
  createLevel,
  updateLevelById,
  fetchLevelById,
  fetchLevels,
  deleteLevelById,
  deleteAllLevels,
} from '../../repositories/level/level-repository.js';
import prisma from '../../config/prismaClient.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';

/**
 * Service function to create a single level.
 *
 * @param {Object} levelData - Object containing level details like name, code, description, order.
 * @returns {Promise<Object>} - Returns the created level object.
 * @throws {CustomError} - Throws an error if level creation fails.
 */
export const createSingleLevel = async (levelData) => {
  const { name, code, description, order } = levelData;

  try {
    // Call the repository to create the level
    const level = await createLevel({ name, code, description, order });

    return level;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    handlePrismaError(error, 'Level');
  }
};

/**
 * Service function to create multiple levels.
 *
 * @param {Array<Object>} levels - Array of level objects, each containing `name`, `code`, etc.
 * @returns {Promise<Array<Object>>} - Returns an array of created level objects.
 * @throws {CustomError} - Throws an error if any level creation fails.
 */
export const createMultipleLevels = async (levels) => {
  try {
    const levelPromises = levels.map((level) => {
      return prisma.level.create({
        data: level,
      });
    });

    // Use $transaction to run all Prisma Client promises in a transaction
    const createdLevels = await prisma.$transaction(levelPromises);

    return createdLevels;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    handlePrismaError(error, 'Level');
  }
};

/**
 * Service function to update a level by its ID.
 *
 * @param {number} id - The ID of the level to update.
 * @param {Object} updateData - Object containing the fields to update (e.g., { name: 'New Name', code: 'NEW123' }).
 * @returns {Promise<Object>} - Returns the updated level object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const updateLevel = async (id, updateData) => {
  try {
    // Call the repository to update the level
    const updatedLevel = await updateLevelById(id, updateData);

    return updatedLevel;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    handlePrismaError(error, 'Level');
  }
};

/**
 * Service function to fetch a single level by its ID.
 *
 * @param {number} id - The ID of the level to fetch.
 * @returns {Promise<Object>} - Returns the level object.
 */
export const getLevelById = async (id) => {
  try {
    const level = await fetchLevelById(id);

    if (!level) {
      throw new CustomError(404, `Level with ID ${id} not found.`);
    }

    return level;
  } catch (error) {
    handlePrismaError(error, 'Level');
  }
};

/**
 * Service function to fetch all levels with pagination and search.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns the levels and pagination info.
 */
export const getLevels = async (query) => {
  try {
    const response = await fetchLevels(query);

    if (!response || response.levels.length === 0) {
      throw new CustomError(404, `There are no levels currently.`);
    }
    return response;
  } catch (error) {
    handlePrismaError(error, 'Level');
  }
};

/**
 * Service function to delete a single level by its ID.
 *
 * @param {number} id - The ID of the level to delete.
 * @returns {Promise<Object>} - Returns the deleted level object.
 */
export const removeLevelById = async (id) => {
  try {
    return await deleteLevelById(id);
  } catch (error) {
    handlePrismaError(error, 'Level');
  }
};

/**
 * Service function to delete all levels.
 *
 * @returns {Promise<number>} - Returns the count of deleted levels.
 */
export const removeAllLevels = async () => {
  try {
    const response = await deleteAllLevels();

    if (!response || response === 0) {
      throw new CustomError(
        404,
        `There are currently no levels available to delete.`
      );
    }
    return response;
  } catch (error) {
    handlePrismaError(error, 'Level');
  }
};
