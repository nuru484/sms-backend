// src/repositories/address/user-address-repository.js
import prisma from '../../config/prismaClient.js';

/**
 * Repository function to create and associate an address with a user in the database.
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
 */
export const updateUserAddress = async (addressId, addressData) => {
  try {
    const updatedAddress = await prisma.address.update({
      where: { id: parseInt(addressId) },
      data: addressData,
    });

    return updatedAddress;
  } catch (error) {
    throw error;
  }
};

export const getUserAddress = async (userId) => {
  try {
    const address = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        address: true, // Fetch the student's address
      },
    });

    return address;
  } catch (error) {
    throw error;
  }
};
