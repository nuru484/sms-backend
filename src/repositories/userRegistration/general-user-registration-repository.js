// src/repositories/userRegistration/generalUserRegistrationRepos.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
import bcrypt from 'bcrypt'; // Bcrypt for password hashing

/**
 * Repository function to create basic user details in the database.
 *
 * @param {Object} userData - Object containing user details like name, email, username, etc.
 * @returns {Promise<Object>} - Returns the created user object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with user creation or database interaction.
 */
export const createUserBasicDetails = async ({
  firstName,
  middleName,
  lastName,
  username,
  gender,
  profilePhoto,
  email,
  password,
  phoneNumber,
  dateOfBirth,
  role,
}) => {
  // Hash the password if provided, using bcrypt for secure storage.
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  // Prepare the user data object to be inserted into the database.
  const userData = {
    firstName,
    middleName: middleName || null, // If middleName is not provided, set it to null.
    lastName,
    username,
    gender,
    profilePhoto: profilePhoto || null, // Default to null if no profile photo is provided.
    email: email || null, // Default to null if no email is provided.
    password: hashedPassword,
    phoneNumber: phoneNumber || null, // Default to null if no phone number is provided.
    dateOfBirth: dateOfBirth || null,
    role,
  };

  try {
    // Use Prisma to insert the user data into the database.
    const user = await prisma.user.create({
      data: userData,
    });

    // Return the created user object.
    return user;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
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
