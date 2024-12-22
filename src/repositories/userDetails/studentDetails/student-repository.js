// src/repositories/student/student-repository.js
import prisma from '../../../config/prismaClient.js'; // Prisma client for database operations

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

export const getStudentCourses = async (studentId) => {
  try {
    const courses = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      select: {
        courses: true,
      },
    });

    return courses;
  } catch (error) {
    throw error;
  }
};

export const getStudentGrades = async (studentId) => {
  try {
    const grades = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      select: {
        Grade: true,
      },
    });

    return grades;
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

export const getStudentExtracurricularActivities = async (studentId) => {
  try {
    const activities = await prisma.student.findMany({
      where: { id: parseInt(studentId) },
      select: {
        ExtracurricularActivity: true,
      },
    });

    return activities;
  } catch (error) {
    throw error;
  }
};

export const getStudentDisciplinaryActions = async (studentId) => {
  try {
    const disciplinaryActions = await prisma.student.findMany({
      where: { id: parseInt(studentId) },
      select: {
        DisciplinaryAction: true,
      },
    });

    return disciplinaryActions;
  } catch (error) {
    throw error;
  }
};

export const getStudentReportDetails = async (studentId) => {
  try {
    const reportDetails = await prisma.student.findMany({
      where: { id: parseInt(studentId) },
      select: {
        ReportDetail: true,
      },
    });

    return reportDetails;
  } catch (error) {
    throw error;
  }
};

export const getStudentReport = async (studentId) => {
  try {
    const studentReport = await prisma.studentReport.findMany({
      where: { studentId: parseInt(studentId) },
    });

    return studentReport;
  } catch (error) {
    throw error;
  }
};

export const getStudentFormerSchool = async (studentId) => {
  try {
    const formerSchool = await prisma.formerSchool.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        AcademicPerformance: true,
        BehaviorAndExtracurricular: true,
        AdministrativeDetails: true,
        HealthAndSupport: true,
      },
    });

    return formerSchool;
  } catch (error) {
    throw error;
  }
};

export const getStudentPayments = async (studentId) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { studentId: parseInt(studentId) },
    });

    return payments;
  } catch (error) {
    throw error;
  }
};

export const getStudentBehavior = async (studentId) => {
  try {
    const studentBehavior = await prisma.studentBehavior.findMany({
      where: { studentId: parseInt(studentId) },
    });

    return studentBehavior;
  } catch (error) {
    throw error;
  }
};
