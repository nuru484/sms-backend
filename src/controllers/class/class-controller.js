// src/controllers/class/class-controller.js

import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js'; // Logger for logging errors and information
import {
  createSingleClass,
  createMultipleClasses,
  updateClass,
  getClassById,
  getClasses,
  removeClassById,
  removeAllClasses,
} from '../../services/class/class-services.js';

/**
 * Controller function to handle class creation.
 *
 * @param {Object} req - Express request object containing the class data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the class creation,
 * or forwards the error to centralized error handling middleware.
 */
export const handleClassCreation = async (req, res, next) => {
  // Extract class data from the request body
  const { classes } = req.body;

  try {
    // Initialize a variable to store the response
    let result;

    // Check if the input is an array and decide whether to handle a single or multiple classes
    if (Array.isArray(classes) && classes.length > 1) {
      // Call the service for creating multiple classes
      result = await createMultipleClasses(classes);
      logger.info(`${classes.length} classes successfully: .`);
    } else if (Array.isArray(classes) && classes.length === 1) {
      // Call the service for creating a single class
      result = await createSingleClass(classes[0]);
      logger.info(`class successfully.`);
    } else {
      // If the input is invalid, throw an error
      throw new CustomError(400, 'Invalid input: "classes" must be an array.');
    }

    // Respond with success
    res.status(201).json({
      message: 'Class(es) created successfully',
      data: result,
    });
  } catch (error) {
    // Forward the error to centralized error handling middleware
    next(error);
  }
};

/**
 * Controller function to handle class updates.
 *
 * @param {Object} req - Express request object containing class data in `req.body` and `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the result of the class update,
 * or forwards the error to centralized error handling middleware.
 */
export const handleClassUpdate = async (req, res, next) => {
  const { id } = req.params; // Extract class ID from request parameters
  const updateData = req.body; // Extract class update data from request body

  try {
    // Call the service to update the class
    const updatedClass = await updateClass(Number(id), updateData);

    // Respond with success
    res.status(200).json({
      message: 'Class updated successfully',
      data: updatedClass,
    });
  } catch (error) {
    // Forward the error to centralized error handling middleware
    next(error);
  }
};

/**
 * Controller to fetch a single class by ID.
 */
export const handleGetClassById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const classData = await getClassById(Number(id));

    res.status(200).json({
      message: 'Class fetched successfully',
      data: classData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all classes with pagination and search.
 */
export const handleGetClasses = async (req, res, next) => {
  const { page, limit, search } = req.query;

  try {
    const result = await getClasses({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    res.status(200).json({
      message: 'Classes fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single class by ID.
 */
export const handleDeleteClassById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedClass = await removeClassById(Number(id));

    res.status(200).json({
      message: 'Class deleted successfully',
      data: deletedClass,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all classes.
 */
export const handleDeleteAllClasses = async (req, res, next) => {
  try {
    const deletedCount = await removeAllClasses();

    res.status(200).json({
      message: `${deletedCount} classes deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
