// src/services/userRegistration/general-registration-service.js
import {
  updateUserAddress,
  createUserAddress,
  getUserAddress,
  deleteUserAddress,
} from '../../repositories/address/user-address-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

const updateAddressDetails = async (addressId, payload) => {
  try {
    const { city, country, region, postalCode, digitalAddress } = payload;

    const address = await getUserAddress(addressId);

    if (!address) {
      throw new CustomError(
        404,
        `Address with ID ${addressId} not found.`,
        404
      );
    }

    const updatedAddress = await updateUserAddress(addressId, {
      city,
      country,
      region,
      postalCode,
      digitalAddress,
    });

    logger.info(`Address updated successfully.`);
    return updatedAddress;
  } catch (error) {
    handlePrismaError(error, 'address details');
  }
};

const getAddressDetails = async (addressId) => {
  try {
    const address = await getUserAddress(addressId);

    if (!address) {
      throw new CustomError(
        404,
        `Address with Id of ${addressId} not found.`,
        404
      );
    }

    return address;
  } catch (error) {
    handlePrismaError(error, 'address details');
  }
};

const deleteAddressDetails = async (addressId) => {
  try {
    const deletedAddress = await deleteUserAddress(addressId);

    if (!deletedAddress) {
      throw new CustomError(
        404,
        `Address with Id of ${addressId} not found.`,
        404
      );
    }

    return deletedAddress;
  } catch (error) {
    handlePrismaError(error, 'address details');
  }
};

export {
  createUserAddress,
  updateAddressDetails,
  getAddressDetails,
  deleteAddressDetails,
};
