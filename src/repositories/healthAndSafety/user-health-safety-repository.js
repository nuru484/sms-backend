//src/repositories/healthAndSafety/user-health-safety-repository.js

import prisma from '../../config/prismaClient.js';

// Create User Health and Safety
export const createUserHealthAndSafety = async (
  userId,
  healthAndSafetyData
) => {
  try {
    const newHealthAndSafety = await prisma.healthAndSafety.create({
      data: {
        ...healthAndSafetyData,
        user: {
          connect: { id: parseInt(userId) },
        },
      },
    });

    return newHealthAndSafety;
  } catch (error) {
    throw error;
  }
};

// Update User Health and Safety
export const updateUserHealthAndSafety = async (
  healthAndSafetyId,
  healthAndSafetyData
) => {
  try {
    const updatedHealthAndSafety = await prisma.healthAndSafety.update({
      where: { id: parseInt(healthAndSafetyId) },
      data: healthAndSafetyData,
    });

    return updatedHealthAndSafety;
  } catch (error) {
    throw error;
  }
};

export const getUserHealthAndSafety = async (healthAndSafetyId) => {
  try {
    const healthAndSafety = await prisma.healthAndSafety.findUnique({
      where: { id: parseInt(healthAndSafetyId) },
    });

    return healthAndSafety;
  } catch (error) {
    throw error;
  }
};

// Delete User Health and Safety
export const deleteUserHealthAndSafety = async (healthAndSafetyId) => {
  try {
    const deletedHealthAndSafety = await prisma.healthAndSafety.delete({
      where: { id: parseInt(healthAndSafetyId) },
    });

    return deletedHealthAndSafety;
  } catch (error) {
    throw error;
  }
};
