// src/services/healthAndSafety/user-health-safety-services.js

import {
  createUserHealthAndSafety,
  updateUserHealthAndSafety,
  getUserHealthAndSafety,
  deleteUserHealthAndSafety,
  getUserAllHealthAndSafety,
} from '../../repositories/healthAndSafety/user-health-safety-repository.js';
import { geUserById } from '../../repositories/users/general-user-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';

/**
 * Service function to create health and safety details for a user.
 */
export const createHealthAndSafetyDetails = async (
  userId,
  healthAndSafetyData
) => {
  try {
    const user = await geUserById(userId);

    if (!user) {
      throw new CustomError(404, `User with ID ${userId} not found.`);
    }

    const newHealthAndSafety = await createUserHealthAndSafety(
      userId,
      healthAndSafetyData
    );

    return newHealthAndSafety;
  } catch (error) {
    handlePrismaError(error, 'health and safety details');
  }
};

/**
 * Service function to update health and safety details for a user.
 */
export const updateHealthAndSafetyDetails = async (
  healthAndSafetyId,
  healthAndSafetyData
) => {
  try {
    const healthAndSafety = await getUserHealthAndSafety(healthAndSafetyId);

    if (!healthAndSafety) {
      throw new CustomError(
        404,
        `Health and Safety details with ID ${healthAndSafetyId} not found.`,
        404
      );
    }

    const updatedHealthAndSafety = await updateUserHealthAndSafety(
      healthAndSafetyId,
      healthAndSafetyData
    );

    return updatedHealthAndSafety;
  } catch (error) {
    handlePrismaError(error, 'health and safety details');
  }
};

/**
 * Service function to get health and safety details by ID.
 */
export const getHealthAndSafetyDetails = async (healthAndSafetyId) => {
  try {
    const healthAndSafety = await getUserHealthAndSafety(healthAndSafetyId);

    if (!healthAndSafety) {
      throw new CustomError(
        404,
        `Health and Safety details with ID ${healthAndSafetyId} not found.`,
        404
      );
    }

    return healthAndSafety;
  } catch (error) {
    handlePrismaError(error, 'health and safety details');
  }
};

/**
 * Service function to delete health and safety details by ID.
 */
export const deleteHealthAndSafetyDetails = async (healthAndSafetyId) => {
  try {
    const deletedHealthAndSafety = await deleteUserHealthAndSafety(
      healthAndSafetyId
    );

    if (!deletedHealthAndSafety) {
      throw new CustomError(
        404,
        `Health and Safety details with ID ${healthAndSafetyId} not found.`,
        404
      );
    }

    return deletedHealthAndSafety;
  } catch (error) {
    handlePrismaError(error, 'health and safety details');
  }
};

// Service function
export const getUserAllHealthAndSafetyService = async (
  userId,
  options = {}
) => {
  try {
    const response = await getUserAllHealthAndSafety(userId, options);

    if (!response || response.healthAndSafety.length === 0) {
      throw new CustomError(
        404,
        `There are no health and safety details for student ID ${studentId}.`
      );
    }

    return response;
  } catch (error) {
    handlePrismaError(error, 'health and safety');
  }
};
