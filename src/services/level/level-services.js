// src/services/level/level-services.js

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
import { saveToCache, client } from '../../config/redis.js';

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
    const level = await createLevel({ name, code, description, order });

    const allLevelsCacheKey = `allLevels`;
    client.del(allLevelsCacheKey); // Invalidate the cache for all levels

    return level;
  } catch (error) {
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
    const levelPromises = levels.map((level) =>
      prisma.level.create({ data: level })
    );

    const createdLevels = await prisma.$transaction(levelPromises);

    const allLevelsCacheKey = `allLevels`;
    client.del(allLevelsCacheKey); // Invalidate the cache for all levels

    return createdLevels;
  } catch (error) {
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
    const levelCacheKey = `level:${id}`;
    const allLevelsCacheKey = `allLevels`;

    await client.del(levelCacheKey); // Invalidate cache for the updated level
    await client.del(allLevelsCacheKey); // Invalidate the cache for all levels

    const updatedLevel = await updateLevelById(id, updateData);

    return updatedLevel;
  } catch (error) {
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

    const levelCacheKey = `level:${id}`;
    saveToCache(levelCacheKey, level); // Save to cache

    return level;
  } catch (error) {
    handlePrismaError(error, 'Level');
  }
};

/**
 * Service function to fetch all levels with pagination and search.
 */
export const getLevels = async (options) => {
  try {
    const response = await fetchLevels(options);

    if (!response || response.levels.length === 0) {
      throw new CustomError(404, `There are no levels currently.`);
    }

    const allLevelsCacheKey = `allLevels`;
    saveToCache(allLevelsCacheKey, response); // Save to cache

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
    const deletedLevel = await deleteLevelById(id);

    const levelCacheKey = `level:${id}`;
    const allLevelsCacheKey = `allLevels`;

    await client.del(levelCacheKey); // Invalidate cache for the deleted level
    await client.del(allLevelsCacheKey); // Invalidate the cache for all levels

    return deletedLevel;
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
    const deletedCount = await deleteAllLevels();

    if (!deletedCount || deletedCount === 0) {
      throw new CustomError(
        404,
        `There are currently no levels available to delete.`
      );
    }

    const allLevelsCacheKey = `allLevels`;
    await client.del(allLevelsCacheKey); // Invalidate the cache for all levels

    return deletedCount;
  } catch (error) {
    handlePrismaError(error, 'Level');
  }
};
