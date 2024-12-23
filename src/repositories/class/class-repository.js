// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

/**
 * Repository function to create a single class in the database.
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

    return newClass; // Return the created class object
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs
    throw error;
  }
};

// Repository function to update a class by its ID in the database.
export const updateClassById = async (id, updateData) => {
  const { name, code, hall, description, roomNumber, levelId } = updateData;

  try {
    // Attempt to update the class in the database
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        code,
        hall,
        description,
        roomNumber,
        level: levelId ? { connect: { id: levelId } } : undefined,
      },
    });

    return updatedClass; // Return the updated class object
  } catch (error) {
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

    return classData;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch classes with pagination and optional search by name.
 *
 * @param {Object} query - Query parameters (page, limit, search).
 * @returns {Promise<Object>} - Returns an object containing the classes and pagination info.
 */
export const fetchClasses = async (options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, search = '' } = options;

  try {
    const skip = (page - 1) * limit;

    // Prepare search filters for name, code, hall, description, and roomNumber
    const searchFilters = {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            code: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            hall: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            roomNumber: {
              equals: isNaN(Number(search)) ? undefined : Number(search), // Exact match for roomNumber
            },
          },
        ],
      }),
    };

    // Fetch total count of classes matching the filters
    const total = await prisma.class.count({
      where: searchFilters,
    });

    let classes;
    if (fetchAll) {
      // Fetch all classes without pagination
      classes = await prisma.class.findMany({
        where: searchFilters,
        orderBy: {
          name: 'asc', // Optional: order classes by name
        },
      });
    } else {
      // Fetch paginated classes with search filters
      classes = await prisma.class.findMany({
        where: searchFilters,
        skip,
        take: limit,
        orderBy: {
          name: 'asc', // Optional: order classes by name
        },
      });
    }

    return {
      classes,
      pagination: fetchAll
        ? null // No pagination if fetching all records
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
    throw error;
  }
};
