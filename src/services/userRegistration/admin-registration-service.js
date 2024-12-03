import { createAdmin } from '../../repositories/userRegistration/admin-registration-repository.js';
import logger from '../../utils/logger.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import prisma from '../../../prismaClient.js';

const processAdminRegistration = async (payload) => {
  const {
    firstName,
    middleName,
    lastName,
    profilePhoto,
    gender,
    role,
    username,
    email,
    phoneNumber,
    password,
    confirmPassword,

    city,
    country,
    region,
    postalCode,
    digitalAddress,
  } = payload;

  try {
    return await prisma.$transaction(async (tx) => {
      const adminRegistrationDetails = {
        basicDetails: {
          firstName,
          middleName,
          lastName,
          profilePhoto,
          gender,
          role,
          username,
          email,
          phoneNumber,
          password,
          confirmPassword,
        },

        address: {
          city,
          country,
          region,
          postalCode,
          digitalAddress,
        },
      };

      // Log the payload for tracking
      logger.info({
        'Attempting to register admin with payload': {
          basicDetails: {
            ...adminRegistrationDetails.basicDetails,
            password: '******',
          },
          address: adminRegistrationDetails.address,
        },
      });

      await createAdmin(adminRegistrationDetails);

      return {
        message: 'Admin registration successful.',
      };
    });
  } catch (error) {
    logger.error({
      'Error processing admin registration': {
        context: 'processAdminRegistration',
        payload: {
          firstName,
          middleName,
          lastName,
          username,
          email,
          city,
          country,
          region,
          digitalAddress,
          phoneNumber,
        },
        errorDetails: {
          errorMessage: error.message,
          errorCode: error.code,
          errorStack: error.stack,
          errorMeta: error.meta,
        },
      },
    });

    throw new CustomError(500, `Admin registration failed: ${error.message}`);
  }
};

export default processAdminRegistration;
