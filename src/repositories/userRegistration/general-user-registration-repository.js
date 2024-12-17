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
export const updateUserBasicDetails = async (userData, userId) => {
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

/**
 * Repository function to create and associate an address with a user in the database.
 *
 * @param {Object} addressData - Object containing address details such as city, country, etc.
 * @returns {Promise<Object>} - Returns the created address object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with address creation or database interaction.
 */
export const createUserAddress = async ({
  city,
  region,
  country,
  digitalAddress,
  postalCode,
  userId,
}) => {
  try {
    // Use Prisma to create the address and link it to the user by userId.
    const newAddress = await prisma.address.create({
      data: {
        city,
        region,
        country,
        postalCode: postalCode || null, // Set postal code to null if not provided.
        digitalAddress,
        user: {
          connect: { id: userId }, // Associate the address with the specified user.
        },
      },
    });

    // Return the created address object.
    return newAddress;
  } catch (error) {
    // Throw a generic internal server error if an unexpected error occurs.
    throw error;
  }
};

/**
 * Repository function to update a user's address in the database.
 *
 * @param {Object} addressData - Object containing updated address details.
 * @param {string} addressId - ID of the address to update.
 * @returns {Promise<Object>} - Returns the updated address object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with address update or database interaction.
 */
export const updateUserAddress = async (addressData, addressId) => {
  try {
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });

    return updatedAddress;
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

/**
 * Repository function to delete a single user by ID from the database.
 *
 * @param {string} userId - ID of the user to delete.
 * @returns {Promise<Object>} - Returns the deleted user object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with user deletion or user is not found.
 */
export const deleteSingleUser = async (userId) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return deletedUser;
  } catch (error) {
    throw error;
  }
};
