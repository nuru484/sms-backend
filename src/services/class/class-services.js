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
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

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

    return newClass;
  } catch (error) {
    handlePrismaError(error, 'class');
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

    const classPromises = classes.map((classData) => createClass(classData));
    const createdClasses = await Promise.all(classPromises);

    return createdClasses;
  } catch (error) {
    handlePrismaError(error, 'class');
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

    return updatedClass;
  } catch (error) {
    handlePrismaError(error, 'class');
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

    if (!classData) {
      throw new CustomError(404, `Class with the ID of ${id} not found.`);
    }

    return classData;
  } catch (error) {
    handlePrismaError(error, 'class');
  }
};

/**
 * Service function to fetch all classes with pagination and search.
 */
export const getClasses = async (options) => {
  try {
    // Call the repository to fetch classes with pagination
    const response = await fetchClasses(options);

    if (!response || response.classes === 0) {
      throw new CustomError(404, 'There are no classes available currently');
    }
    return response;
  } catch (error) {
    handlePrismaError(error, 'class');
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
    handlePrismaError(error, 'class');
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

    if (deletedCount === 0) {
      throw new CustomError(404, 'There are no classes to delete.');
    }

    return deletedCount;
  } catch (error) {
    handlePrismaError(error, 'class');
  }
};
