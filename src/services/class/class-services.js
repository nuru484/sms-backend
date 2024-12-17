// src/services/class/class-services.js

import {
  createClass,
  updateClassById,
  fetchClassById,
  fetchClasses,
  deleteClassById,
  deleteAllClasses,
} from '../../repositories/class/class-repository.js'; // Import the class repository functions
import logger from '../../utils/logger.js'; // Logger for logging operations
import prisma from '../../config/prismaClient.js'; // Assuming you're using Prisma for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { validateUniqueFieldsForUpdate } from '../../utils/helpers/validation-helpers.js';

/**
 * Service function to create a single class.
 *
 * @param {Object} classData - Object containing class details like name, code, hall, etc.
 * @returns {Promise<Object>} - Returns the created class object.
 * @throws {CustomError} - Throws an error if class creation fails.
 */
export const createSingleClass = async (classData) => {
  const { name, code, hall, description, roomNumber, levelId } = classData;

  try {
    // Log the class creation attempt
    logger.info(`Attempting to create a single class: ${name}`);

    // Check if levelId is provided
    if (levelId) {
      // Validate the level ID
      const level = await prisma.level.findUnique({
        where: { id: parseInt(levelId) },
      });

      if (!level) {
        throw new CustomError(404, `Level with ID ${levelId} not found.`);
      }
    } else {
      logger.warn(`No levelId provided for class: ${name}`);
    }

    // Call the repository to create the class
    const newClass = await createClass({
      name,
      code,
      hall,
      description,
      roomNumber,
      levelId,
    });

    // Log the success
    logger.info(`Class created successfully: ${newClass.id}`);

    return newClass;
  } catch (error) {
    // Log the error
    logger.error({
      'Error creating single class': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

/**
 * Service function to create multiple classes.
 *
 * @param {Array<Object>} classes - Array of class objects, each containing `name`, `code`, etc.
 * @returns {Promise<Array<Object>>} - Returns an array of created class objects.
 * @throws {CustomError} - Throws an error if any class creation fails.
 */
export const createMultipleClasses = async (classes) => {
  try {
    // Check and validate levelIds for each class
    const levelValidationPromises = classes.map(async (classData) => {
      if (classData.levelId) {
        const level = await prisma.level.findUnique({
          where: { id: parseInt(classData.levelId) },
        });

        if (!level) {
          throw new CustomError(
            404,
            `Level with ID ${classData.levelId} not found.`
          );
        }
      } else {
        logger.warn(`No levelId provided for class: ${classData.name}`);
      }
    });

    // Wait for all level validations to complete
    await Promise.all(levelValidationPromises);

    // Log the batch class creation attempt
    logger.info(
      `Attempting to create multiple classes: ${classes.length} classes`
    );

    const classPromises = classes.map((classData) => createClass(classData));
    const createdClasses = await Promise.all(classPromises);

    // Log the success
    logger.info(`Successfully created ${createdClasses.length} classes.`);

    return createdClasses;
  } catch (error) {
    // Log the error
    logger.error({
      'Error creating multiple classes': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw the error
    throw error;
  }
};

/**
 * Service function to update a class by its ID.
 *
 * @param {number} id - The ID of the class to update.
 * @param {Object} updateData - Object containing the fields to update (e.g., { name: 'New Name', code: 'NEW123' }).
 * @returns {Promise<Object>} - Returns the updated class object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const updateClass = async (id, updateData) => {
  try {
    // Log the class update attempt
    logger.info({
      'Attempting to update class': {
        classId: id,
        updateData,
      },
    });

    // Validate fields for uniqueness
    const uniqueFields = ['name', 'code', 'hall', 'roomNumber'];
    await validateUniqueFieldsForUpdate(updateData, uniqueFields, id, 'class');

    // Validate the levelId if provided
    if (updateData.levelId) {
      const level = await prisma.level.findUnique({
        where: { id: parseInt(updateData.levelId) },
      });

      if (!level) {
        throw new CustomError(
          404,
          `Level with ID ${updateData.levelId} not found.`
        );
      }
    } else {
      logger.warn(`No levelId provided for class: ${updateData.name || id}`);
    }

    // Perform the update
    const updatedClass = await updateClassById(id, updateData);

    // Log the successful update
    logger.info({
      'Class updated successfully': {
        classId: updatedClass.id,
        updatedFields: updateData,
      },
    });

    return updatedClass;
  } catch (error) {
    // Log the full error for debugging
    logger.error({
      'Error updating class': {
        classId: id,
        error: error.message || 'No error message available',
        stack: error.stack || 'No stack trace available',
        errorDetails: error, // Log the full error object
      },
    });

    // Rethrow the error
    throw error;
  }
};

/**
 * Service function to fetch a single class by its ID.
 *
 * @param {number} id - The ID of the class to fetch.
 * @returns {Promise<Object>} - Returns the class object if found.
 * @throws {CustomError} - Throws an error if the class is not found.
 */
export const getClassById = async (id) => {
  try {
    // Call the repository to fetch the class by ID
    const classData = await fetchClassById(id);

    return classData;
  } catch (error) {
    // Log the error
    logger.error({
      'Error fetching class by ID': {
        classId: id,
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw the error if class fetching fails
    throw error;
  }
};

/**
 * Service function to fetch all classes with pagination and search.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns the classes and pagination info.
 */
export const getClasses = async (query) => {
  try {
    // Call the repository to fetch classes with pagination
    const result = await fetchClasses(query);

    return result;
  } catch (error) {
    // Log the error
    logger.error({
      'Error fetching classes with pagination': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw the error if fetching fails
    throw error;
  }
};

/**
 * Service function to delete a single class by its ID.
 *
 * @param {number} id - The ID of the class to delete.
 * @returns {Promise<Object>} - Returns the deleted class object.
 * @throws {CustomError} - Throws an error if the class deletion fails.
 */
export const removeClassById = async (id) => {
  try {
    // Call the repository to delete the class by ID
    const deletedClass = await deleteClassById(id);

    return deletedClass;
  } catch (error) {
    // Log the error
    logger.error({
      'Error deleting class by ID': {
        classId: id,
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw the error if deletion fails
    throw error;
  }
};

/**
 * Service function to delete all classes.
 *
 * @returns {Promise<number>} - Returns the count of deleted classes.
 */
export const removeAllClasses = async () => {
  try {
    // Call the repository to delete all classes
    const deletedCount = await deleteAllClasses();

    return deletedCount;
  } catch (error) {
    // Log the error
    logger.error({
      'Error deleting all classes': {
        error: error.message,
        stack: error.stack,
      },
    });

    // Throw the error if deletion fails
    throw error;
  }
};
