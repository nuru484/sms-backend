// src/repositories/student/student-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations

export const getStudentById = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      include: {
        user: true,
        StudentApplicationNumber: true,
      },
    });

    return student;
  } catch (error) {
    throw error;
  }
};

export const deleteAllStudents = async () => {
  try {
    const deletedCount = await prisma.student.deleteMany({});

    return { message: `${deletedCount.count} students deleted.` };
  } catch (error) {
    throw error;
  }
};

export const getStudentParents = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      include: {
        parents: {
          include: {
            user: true, // Include related 'user' details for each parent
          },
        },
      },
    });

    return student?.parents; // Return the parents, or empty array if not found
  } catch (error) {
    throw error; // Re-throw error to be handled higher up
  }
};
