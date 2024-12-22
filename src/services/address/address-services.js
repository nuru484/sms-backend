// src/services/userRegistration/general-registration-service.js
import {
  updateUserAddress,
  createUserAddress,
} from '../../repositories/address/user-address-repository.js';

import { CustomError } from '../../utils/middleware/errorHandler.js';
import prisma from '../../config/prismaClient.js';
import logger from '../../utils/logger.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

const updateAddressDetails = async (addressId, payload) => {
  try {
    const { city, country, region, postalCode, digitalAddress } = payload;

    const address = await prisma.address.findUnique({
      where: {
        id: parseInt(addressId),
      },
    });

    if (!address) {
      throw new CustomError(`Address with ID ${addressId} not found.`, 404);
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

export { createUserAddress, updateAddressDetails };
