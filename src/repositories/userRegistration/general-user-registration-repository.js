// src/repositories/userRegistration/generalUserRegistrationRepos.js

// Import necessary modules
import prisma from '../../../prismaClient.js'; // Prisma client for database operations
import { CustomError } from '../../utils/middleware/errorHandler.js'; // Custom error handling utility
import logger from '../../utils/logger.js'; // Logger for logging operations and errors
import bcrypt from 'bcryptjs'; // Bcrypt for password hashing

/**
 * Repository function to create basic user details in the database.
 *
 * @param {Object} userData - Object containing user details like name, email, username, etc.
 * @returns {Promise<Object>} - Returns the created user object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with user creation or database interaction.
 */
const createUserBasicDetails = async ({
  firstName,
  middleName,
  lastName,
  username,
  gender,
  profilePhoto,
  email,
  password,
  phoneNumber,
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
    role,
  };

  try {
    // Log the attempt to create a user in the database.
    logger.info({
      'Attempting to create a user in the database': {
        userData,
      },
    });

    // Use Prisma to insert the user data into the database.
    const user = await prisma.user.create({
      data: userData,
    });

    // Log the successful creation of the user.
    logger.info('User successfully created in the database.', {
      userId: user.id,
    });

    // Return the created user object.
    return user;
  } catch (error) {
    // Log any errors encountered during the user creation process.
    logger.error({
      'Database error during user creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific error codes, such as duplicate entries, and throw appropriate custom errors.
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate entry: ${error.meta?.target || error.message}`
      );
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

/**
 * Repository function to create and associate an address with a user in the database.
 *
 * @param {Object} addressData - Object containing address details such as city, country, etc.
 * @returns {Promise<Object>} - Returns the created address object if successful.
 * @throws {CustomError} - Throws a custom error if there is a problem with address creation or database interaction.
 */
const createUserAddress = async ({
  city,
  region,
  country,
  digitalAddress,
  postalCode,
  userId,
}) => {
  try {
    // Log the attempt to create an address and associate it with the user.
    logger.info(
      'Attempting to create user address and connect to user in the database'
    );

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

    // Log the successful creation of the address and its connection to the user.
    logger.info({
      'Address successfully created and connected to the user': {
        addressId: newAddress.id,
        userId: newAddress.userId,
      },
    });

    // Return the created address object.
    return newAddress;
  } catch (error) {
    // Log any errors encountered during the address creation process.
    logger.error({
      'Database error during address creation and connection to user': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle specific error codes, such as duplicate entries and user not found, and throw appropriate custom errors.
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate user details: ${error.meta?.target || error.message}`
      );
    }
    if (error.code === 'P2025') {
      throw new CustomError(400, `User not found: ${error.message}`);
    }

    // Throw a generic internal server error if an unexpected error occurs.
    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

// Export the functions to be used in other parts of the application.
export { createUserAddress, createUserBasicDetails };
