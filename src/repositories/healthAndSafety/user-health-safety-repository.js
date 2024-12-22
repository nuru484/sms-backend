//src/repositories/healthAndSafety/user-health-safety-repository.js

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

export const getUserHealthAndSafety = async (userId) => {
  try {
    const healthAndSafety = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        HealthAndSafety: true,
      },
    });

    return healthAndSafety;
  } catch (error) {
    throw error;
  }
};

// Delete User Health and Safety
export const deleteUserHealthAndSafety = async (userId) => {
  try {
    const deletedHealthAndSafety = await prisma.healthAndSafety.delete({
      where: { userId: parseInt(userId) },
    });

    return deletedHealthAndSafety;
  } catch (error) {
    throw error;
  }
};
