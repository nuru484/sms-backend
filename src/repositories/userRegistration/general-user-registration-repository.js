// src/repositories/userRegistration/generalUserRegistrationRepos.js

import prisma from '../../../prismaClient.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import bcrypt from 'bcryptjs';

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
}) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const userData = {
    firstName,
    middleName: middleName || null,
    lastName,
    username,
    gender,
    profilePhoto: profilePhoto || null,
    email: email || null,
    password: hashedPassword,
    phoneNumber: phoneNumber || null,
  };

  try {
    logger.info({
      'Attempting to create a user in the database': {
        userData,
      },
    });

    const user = await prisma.user.create({
      data: userData,
    });

    logger.info('User successfully created in the database.', {
      userId: user.id,
    });

    return user;
  } catch (error) {
    logger.error({
      'Database error during user creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate entry: ${error.meta?.target || error.message}`
      );
    }

    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

const createUserAddress = async ({
  city,
  region,
  country,
  digitalAddress,
  postalCode,
  userId,
}) => {
  try {
    logger.info(
      'Attempting to create user address and connect to user in the database'
    );

    // Create the address and connect it to the user
    const newAddress = await prisma.address.create({
      data: {
        city,
        region,
        country,
        postalCode: postalCode || null, // Set to null if not provided
        digitalAddress,
        user: {
          connect: { id: userId }, // Connect address to the user
        },
      },
    });

    logger.info({
      'Address successfully created and connected to the user': {
        addressId: newAddress.id,
        userId: newAddress.userId,
      },
    });

    return newAddress;
  } catch (error) {
    logger.error({
      'Database error during address creation and connection to user': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Handle potential errors
    if (error.code === 'P2002') {
      throw new CustomError(
        400,
        `Duplicate user details: ${error.meta?.target || error.message}`
      );
    }
    if (error.code === 'P2025') {
      throw new CustomError(400, `User not found: ${error.message}`);
    }

    throw new CustomError(500, `Internal Server Error: ${error.message}`);
  }
};

export { createUserAddress, createUserBasicDetails };
