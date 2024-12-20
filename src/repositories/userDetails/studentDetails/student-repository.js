// src/repositories/student/student-repository.js

// Import necessary modules
import prisma from '../../../config/prismaClient.js'; // Prisma client for database operations

// Helper function to get student details by userId
export const getStudentByUserId = async (id) => {
  try {
    // Fetch the student record based on userId
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }, // Lookup student by userId
      include: {
        user: {
          include: {
            address: true, // Include related address data within user
            Position: true, // Include related position data within user
            Attendance: true, // Include related attendance data within user
            EventParticipant: true, // Include related event participant data within user
            HealthAndSafety: true, // Include related health and safety data within user
            StudentBehavior: true, // Include related student behavior data within user
          },
        },
        level: true, // Include the level of the student (optional)
        parents: true,
        courses: true,
        Trip: true,
        Grade: true,
        StudentReport: true,
        ReportDetail: true,
        Payment: true,
        Sale: true,
        BookIssue: true,
        DisciplinaryAction: true,
        StudentApplicationNumber: true,
        FormerSchool: true,
        StudentBehavior: true,
        ExtracurricularActivity: true,
      },
    });

    return student;
  } catch (error) {
    throw error;
  }
};

export const getStudentDetails = async (id) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }, // Lookup student by ID
    });

    return student;
  } catch (error) {
    throw error;
  }
};

export const getStudentAddress = async (id) => {
  try {
    const address = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        address: true, // Fetch the student's address
      },
    });

    return address;
  } catch (error) {
    throw error;
  }
};

export const getStudentCourses = async (id) => {
  try {
    const courses = await prisma.course.findMany({
      where: { studentId: parseInt(id) },
    });

    return courses;
  } catch (error) {
    throw error;
  }
};

export const getStudentGrades = async (id) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { studentId: parseInt(id) },
    });

    return grades;
  } catch (error) {
    throw error;
  }
};

export const getStudentAttendance = async (id) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: parseInt(id) },
    });

    return attendance;
  } catch (error) {
    throw error;
  }
};

export const getStudentParents = async (id) => {
  try {
    const parents = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      select: {
        parents: true, // Fetch parent details
      },
    });

    return parents;
  } catch (error) {
    throw error;
  }
};

export const getStudentExtracurricularActivities = async (id) => {
  try {
    const activities = await prisma.extracurricularActivity.findMany({
      where: { studentId: parseInt(id) },
    });

    return activities;
  } catch (error) {
    throw error;
  }
};

export const getStudentDisciplinaryActions = async (id) => {
  try {
    const disciplinaryActions = await prisma.disciplinaryAction.findMany({
      where: { studentId: parseInt(id) },
    });

    return disciplinaryActions;
  } catch (error) {
    throw error;
  }
};

export const getStudentHealthAndSafety = async (id) => {
  try {
    const healthAndSafety = await prisma.healthAndSafety.findMany({
      where: { studentId: parseInt(id) },
    });

    return healthAndSafety;
  } catch (error) {
    throw error;
  }
};

export const getStudentReportDetails = async (id) => {
  try {
    const reportDetails = await prisma.reportDetail.findMany({
      where: { studentId: parseInt(id) },
    });

    return reportDetails;
  } catch (error) {
    throw error;
  }
};

export const getStudentFormerSchool = async (id) => {
  try {
    const formerSchool = await prisma.formerSchool.findMany({
      where: { studentId: parseInt(id) },
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

export const getStudentEventParticipation = async (id) => {
  try {
    const eventParticipants = await prisma.eventParticipant.findMany({
      where: { studentId: parseInt(id) },
    });

    return eventParticipants;
  } catch (error) {
    throw error;
  }
};

export const getStudentPayments = async (id) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { studentId: parseInt(id) },
    });

    return payments;
  } catch (error) {
    throw error;
  }
};
