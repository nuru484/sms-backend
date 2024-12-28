// src/repositories/userRegistration/generalUserRegistrationRepos.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import bcrypt from 'bcrypt'; // Bcrypt for password hashing

/**
 * Repository function to create basic user details in the database.
 *
 * @param {Object} userData - Object containing user details like name, email, username, etc.
 * @returns {Promise<Object>} - Returns the created user object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with user creation or database interaction.
 */
export const createUserBasicDetails = async (userDetails) => {
  const { confirmPassword, ...sanitizedDetails } = userDetails;

  // Hash the password if provided, using bcrypt for secure storage.
  const hashedPassword = sanitizedDetails.password
    ? await bcrypt.hash(sanitizedDetails.password, 10)
    : null;

  sanitizedDetails.password = hashedPassword;

  try {
    const user = await prisma.user.create({
      data: sanitizedDetails,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to update a user's basic details in the database.
 *
 * @param {Object} userData - Object containing updated user details.
 * @param {string} userId - ID of the user to update.
 * @returns {Promise<Object>} - Returns the updated user object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with user update or database interaction.
 */
export const updateUserBasicDetails = async (userId, userData) => {
  const hashedPassword = userData.password
    ? await bcrypt.hash(userData.password, 10)
    : null;

  userData.password = hashedPassword;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};
