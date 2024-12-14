// src/services/level/level-creation-service.js

import {
  createLevel,
  updateLevelById,
  fetchLevelById,
  fetchLevels,
  deleteLevelById,
  deleteAllLevels,
} from '../../repositories/level/level-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import prisma from '../../../prismaClient.js';

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
    // Log the level creation attempt
    logger.info(`Attempting to create a single level: ${name}`);

    // Call the repository to create the level
    const level = await createLevel({ name, code, description, order });

    // Log the success
    logger.info(`Level created successfully: ${level.id}`);

    return level;
  } catch (error) {
    // Log the error
    logger.error({
      'Error creating single level': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a custom error
    throw new CustomError(500, `Level creation failed: ${error.message}`);
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
    // Log the batch level creation attempt
    logger.info(
      `Attempting to create multiple levels: ${levels.length} levels`
    );

    const levelPromises = levels.map((level) => {
      return prisma.level.create({
        data: level,
      });
    });

    // Use $transaction to run all Prisma Client promises in a transaction
    const createdLevels = await prisma.$transaction(levelPromises);

    // Log the success
    logger.info(`Successfully created ${createdLevels.length} levels.`);

    return createdLevels;
  } catch (error) {
    // Log the error
    logger.error({
      'Error creating multiple levels': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a custom error
    throw new CustomError(500, `Batch level creation failed: ${error.message}`);
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
    // Log the level update attempt
    logger.info({
      'Attempting to update level': {
        levelId: id,
        updateData,
      },
    });

    // Call the repository to update the level
    const updatedLevel = await updateLevelById(id, updateData);

    // Log the successful update
    logger.info({
      'Level updated successfully': {
        levelId: updatedLevel.id,
        updatedFields: updateData,
      },
    });

    return updatedLevel;
  } catch (error) {
    // Log the error
    logger.error({
      'Error updating level': {
        levelId: id,
        error: error.message,
        stack: error.stack,
      },
    });

    // Rethrow the error as a CustomError
    throw new CustomError(
      error.statusCode || 500,
      `Failed to update level: ${error.message}`
    );
  }
};

/**
 * Service function to fetch a single level by its ID.
 *
 * @param {number} id - The ID of the level to fetch.
 * @returns {Promise<Object>} - Returns the level object.
 */
export const getLevelById = async (id) => {
  return await fetchLevelById(id);
};

/**
 * Service function to fetch all levels with pagination and search.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns the levels and pagination info.
 */
export const getLevels = async (query) => {
  return await fetchLevels(query);
};

/**
 * Service function to delete a single level by its ID.
 *
 * @param {number} id - The ID of the level to delete.
 * @returns {Promise<Object>} - Returns the deleted level object.
 */
export const removeLevelById = async (id) => {
  return await deleteLevelById(id);
};

/**
 * Service function to delete all levels.
 *
 * @returns {Promise<number>} - Returns the count of deleted levels.
 */
export const removeAllLevels = async () => {
  return await deleteAllLevels();
};
