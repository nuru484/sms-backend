// src/repositories/student/student-repository.js

// Import necessary modules
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

// Helper function to get student details by userId
export const getStudentByUserId = async (id) => {
  try {
    // Fetch the student record based on userId
    const student = await prisma.student.findUnique({
      where: { id }, // Lookup student by userId
      include: {
        user: true, // Include related user data, if needed
        level: true, // Include the level of the student (optional)
      },
    });

    return student;
  } catch (error) {
    throw error;
  }
};
