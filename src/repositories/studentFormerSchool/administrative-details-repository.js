// src/repositories/studentFormerSchool/administrative-details-repository.js

import prisma from '../../../prismaClient.js'; // Prisma client for database operations
import logger from '../../utils/logger.js'; // Logger utility for structured logging

// Function to create administrative details
export const createAdministrativeDetails = async ({
  transferCertificateUrl,
  recommendationLetterUrl,
  feesCleared,
  formerSchoolId,
}) => {
  try {
    const administrativeDetailsData = {
      transferCertificate: transferCertificateUrl,
      recommendationLetter: recommendationLetterUrl,
      feesCleared,
    };

    const administrativeDetailsDataToCreate = {
      ...administrativeDetailsData,
      formerSchool: {
        connect: { id: parseInt(formerSchoolId) },
      },
    };

    // Log the attempt to create administrative details in the database
    logger.info({
      'Attempting to create administrative details in the database': {
        data: administrativeDetailsDataToCreate,
      },
    });

    // Create the administrative details record
    const administrativeDetails = await prisma.administrativeDetails.create({
      data: administrativeDetailsDataToCreate,
    });

    // Log success
    logger.info({
      'Administrative details successfully created in the database': {
        administrativeDetailsId: administrativeDetails.id,
      },
    });

    return administrativeDetails;
  } catch (error) {
    logger.error({
      'Database error during administrative details creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });
    throw error;
  }
};

// Function to update administrative details
export const updateAdministrativeDetails = async (id, updateData) => {
  try {
    // Log the update attempt
    logger.info({
      'Attempting to update administrative details in the database': {
        id,
        updateData,
      },
    });

    // Perform the update operation
    const updatedAdministrativeDetails =
      await prisma.administrativeDetails.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

    // Log success
    logger.info({
      'Administrative details successfully updated in the database': {
        administrativeDetailsId: updatedAdministrativeDetails.id,
      },
    });

    return updatedAdministrativeDetails;
  } catch (error) {
    logger.error({
      'Database error during administrative details update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });
    throw error;
  }
};

// Get administrative details by ID
export const getAdministrativeDetailsById = async (id) => {
  return prisma.administrativeDetails.findUnique({
    where: { id: parseInt(id) },
  });
};
