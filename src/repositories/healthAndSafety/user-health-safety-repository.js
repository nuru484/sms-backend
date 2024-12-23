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

// Repository function
export const getUserAllHealthAndSafety = async (userId, options = {}) => {
  const { page = 1, limit = 10, fetchAll = false, searchQuery = '' } = options;

  try {
    // Prepare search filters based on the searchQuery
    const searchFilters = {
      userId: parseInt(userId),
      ...(searchQuery && {
        OR: [
          {
            emergencyContactName: {
              contains: searchQuery, // Match searchQuery in emergencyContactName
              mode: 'insensitive', // Case insensitive match
            },
          },
          {
            emergencyContactPhone: {
              contains: searchQuery, // Match searchQuery in emergencyContactPhone
              mode: 'insensitive', // Case insensitive match
            },
          },
          {
            allergies: {
              hasSome: [searchQuery], // Match if searchQuery is present in allergies array
            },
          },
          {
            medicalConditions: {
              hasSome: [searchQuery], // Match if searchQuery is present in medicalConditions array
            },
          },
          {
            healthInsurancePolicyId: {
              contains: searchQuery, // Match searchQuery in healthInsurancePolicyId
              mode: 'insensitive', // Case insensitive match
            },
          },
          {
            comments: {
              contains: searchQuery, // Match searchQuery in comments
              mode: 'insensitive', // Case insensitive match
            },
          },
        ],
      }),
    };

    if (fetchAll) {
      // Fetch all health and safety records without pagination and apply search filters
      return await prisma.healthAndSafety.findMany({
        where: searchFilters,
      });
    }

    // Paginate results with search filters applied
    const skip = (page - 1) * limit;
    return await prisma.healthAndSafety.findMany({
      where: searchFilters,
      skip,
      take: limit,
    });
  } catch (error) {
    throw error;
  }
};
