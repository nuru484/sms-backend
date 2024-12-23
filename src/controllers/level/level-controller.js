// src/controllers/level/level-controller.js

import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js'; // Logger for logging errors and information
import {
  createSingleLevel,
  createMultipleLevels,
  updateLevel,
  getLevelById,
  getLevels,
  removeLevelById,
  removeAllLevels,
} from '../../services/level/level-services.js';

/**
 * Controller function to handle level creation.
 *
 * @param {Object} req - Express request object containing the level data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the level creation,
 * or forwards the error to centralized error handling middleware.
 */
export const handleLevelCreation = async (req, res, next) => {
  // Extract level data from the request body
  const { levels } = req.body;

  try {
    // Initialize a variable to store the response
    let result;

    // Check if the input is an array and decide whether to handle a single or multiple levels
    if (Array.isArray(levels) && levels.length > 1) {
      // Call the service for creating multiple levels
      result = await createMultipleLevels(levels);
    } else if (Array.isArray(levels) && levels.length === 1) {
      // Call the service for creating a single level
      result = await createSingleLevel(levels[0]);
    } else {
      // If the input is invalid, throw an error
      throw new CustomError(400, 'Invalid input: "levels" must be an array.');
    }

    // Respond with success
    res.status(201).json({
      message: 'Level(s) created successfully',
      data: result,
    });
  } catch (error) {
    // Forward the error to centralized error handling middleware
    next(error);
  }
};

/**
 * Controller function to handle level updates.
 *
 * @param {Object} req - Express request object containing level data in `req.body` and `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the result of the level update,
 * or forwards the error to centralized error handling middleware.
 */
export const handleLevelUpdate = async (req, res, next) => {
  const { id } = req.params; // Extract level ID from request parameters
  const updateData = req.body; // Extract level update data from request body

  try {
    // Call the service to update the level
    const updatedLevel = await updateLevel(Number(id), updateData);

    // Respond with success
    res.status(200).json({
      message: 'Level updated successfully',
      data: updatedLevel,
    });
  } catch (error) {
    // Forward the error to centralized error handling middleware
    next(error);
  }
};

/**
 * Controller to fetch a single level by ID.
 */
export const handleGetLevelById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const level = await getLevelById(Number(id));

    res.status(200).json({
      message: 'Level fetched successfully',
      data: level,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all levels with pagination and search.
 */
export const handleGetLevels = async (req, res, next) => {
  try {
    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll === 'true',
      searchQuery: searchQuery ? searchQuery : null,
    };

    const result = await getLevels(options);

    res.status(200).json({
      message: 'Levels fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single level by ID.
 */
export const handleDeleteLevelById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedLevel = await removeLevelById(Number(id));
    res.status(200).json({
      message: 'Level deleted successfully',
      data: deletedLevel,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all levels.
 */
export const handleDeleteAllLevels = async (req, res, next) => {
  try {
    const deletedCount = await removeAllLevels();

    res.status(200).json({
      message: `${deletedCount} levels deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
