// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors

/**
 * Repository function to create a single class in the database.
 *
 * @param {Object} classData - Object containing class details like name, code, hall, etc.
 * @returns {Promise<Object>} - Returns the created class object if successful.
 * @throws {CustomError} - Throws a custom error if there is an issue during the creation process or database interaction.
 */
export const createClass = async ({
  name,
  code,
  hall,
  description,
  roomNumber,
  levelId,
}) => {
  try {
    // Log the attempt to create a class in the database
    logger.info({
      'Attempting to create class in the database': {
        classData: {
          name,
          code,
          hall,
          description,
          roomNumber,
          levelId,
        },
      },
    });

    // Create the class record in the database using Prisma
    const newClass = await prisma.class.create({
      data: {
        name,
        code,
        hall,
        description,
        roomNumber,
        level: levelId ? { connect: { id: levelId } } : undefined,
      },
    });

    // Log the successful creation of the class
    logger.info({
      'Class successfully created in the database.': {
        classId: newClass.id,
      },
    });

    return newClass; // Return the created class object
  } catch (error) {
    // Log any errors encountered during the class creation process
    logger.error({
      'Database error during class creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific Prisma error codes, such as duplicate entries, and throw appropriate custom errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate class details: ${error.meta?.target || error.message}`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

/**
 * Repository function to update a class by its ID in the database.
 *
 * @param {number} id - The ID of the class to be updated.
 * @param {Object} updateData - The data to update (e.g., { name: 'New Name', code: 'NEW123' }).
 * @returns {Promise<Object>} - Returns the updated class object if successful.
 * @throws {CustomError} - Throws a custom error if the class is not found or if there is a database error.
 */
export const updateClassById = async (id, updateData) => {
  try {
    // Log the attempt to update the class
    logger.info({
      'Attempting to update class': {
        classId: id,
        updateData,
      },
    });

    // Attempt to update the class in the database
    const updatedClass = await prisma.class.update({
      where: { id },
      data: updateData,
    });

    // Log the successful update
    logger.info({
      'Class successfully updated': {
        classId: updatedClass.id,
        updatedFields: updateData,
      },
    });

    return updatedClass; // Return the updated class object
  } catch (error) {
    // Handle the case where the class is not found
    if (error.code === 'P2025') {
      logger.warn({
        'Class not found during update': { classId: id },
      });
      throw new CustomError(404, `Class with ID ${id} not found.`);
    }

    // Log unexpected errors and rethrow them as internal server errors
    logger.error({
      'Database error during class update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};

/**
 * Repository function to fetch a single class by its ID.
 *
 * @param {number} id - The ID of the class to fetch.
 * @returns {Promise<Object>} - Returns the class object if found.
 * @throws {CustomError} - Throws a custom error if the class is not found or there's a database error.
 */
export const fetchClassById = async (id) => {
  try {
    // Fetch the class by ID
    const classData = await prisma.class.findUnique({
      where: { id },
    });

    if (!classData) {
      throw new CustomError(404, `Class with ID ${id} not found.`);
    }

    return classData;
  } catch (error) {
    logger.error({
      'Error fetching class by ID': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};

/**
 * Repository function to fetch classes with pagination and optional search by name.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns an object containing the classes and pagination info.
 */
export const fetchClasses = async ({ page = 1, limit = 10, search = '' }) => {
  try {
    const skip = (page - 1) * limit;

    // Fetch the total number of classes
    const total = await prisma.class.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });

    // Fetch the classes with pagination and search
    const classes = await prisma.class.findMany({
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
      classes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error({
      'Error fetching classes with pagination': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};

/**
 * Repository function to delete a single class by ID.
 *
 * @param {number} id - The ID of the class to delete.
 * @returns {Promise<Object>} - Returns the deleted class object.
 */
export const deleteClassById = async (id) => {
  try {
    const deletedClass = await prisma.class.delete({
      where: { id },
    });

    return deletedClass;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new CustomError(404, `Class with ID ${id} not found.`);
    }

    logger.error({
      'Error deleting class by ID': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};

/**
 * Repository function to delete all classes.
 *
 * @returns {Promise<number>} - Returns the count of deleted classes.
 */
export const deleteAllClasses = async () => {
  try {
    const deletedCount = await prisma.class.deleteMany();

    return deletedCount.count;
  } catch (error) {
    logger.error({
      'Error deleting all classes': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    throw error;
  }
};
