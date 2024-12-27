// src/repositories/users/general-user-repository.js
import prisma from '../../config/prismaClient.js';

export const fetchUsers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    fetchAll = false,
    search = '',
    role = null, // Additional role parameter
  } = options;

  try {
    const skip = (page - 1) * limit;

    // Prepare search filters for username, firstName, middleName, lastName, phoneNumber
    const searchFilters = {
      ...(search && {
        OR: [
          {
            username: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            middleName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            phoneNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    // Include role filter if specified
    const roleFilter = role ? { role } : {};

    // Combine filters
    const filters = {
      ...searchFilters,
      ...roleFilter,
    };

    // Fetch total count of users matching the filters
    const total = await prisma.user.count({
      where: filters,
    });

    let users;
    if (fetchAll) {
      // Fetch all users without pagination
      users = await prisma.user.findMany({
        where: filters,
        orderBy: {
          firstName: 'asc', // Optional: order users by first name
        },
      });
    } else {
      // Fetch paginated users with search filters
      users = await prisma.user.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: {
          firstName: 'asc', // Optional: order users by first name
        },
      });
    }

    return {
      users,
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

export const getUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    return deletedUser;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all users from the database.
 *
 * @returns {Promise<number>} - Returns the count of deleted users if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with user deletion.
 */
export const deleteAllUsers = async () => {
  try {
    const result = await prisma.user.deleteMany({});

    return result.count;
  } catch (error) {
    throw error;
  }
};
