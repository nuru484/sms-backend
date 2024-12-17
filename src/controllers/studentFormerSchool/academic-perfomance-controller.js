// src/controllers/studentFormerSchool/academic-perfomance-controller.js

import {
  createAcademicPerformanceForStudent,
  updateAcademicPerformanceForStudent,
} from '../../services/studentFormerSchool/academic-perfomance-services.js';

// ################################################################################################

// Controller to handle the creation of academic performance for a student
export const createAcademicPerformance = async (req, res, next) => {
  try {
    // Extract userId from the request parameters
    const { studentId, formerSchoolId } = req.params;

    // Extract required data from the request body
    const academicPerformanceData = req.body;

    // Call the service layer to handle the logic for creating academic performance details
    const academicPerformance = await createAcademicPerformanceForStudent(
      studentId,
      formerSchoolId,
      academicPerformanceData
    );

    // Respond to the client with the created academic performance details
    return res.status(201).json({
      message: 'Academic performance details created successfully',
      academicPerformance,
    });
  } catch (error) {
    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};

// ################################################################################################

// Controller to handle the update of academic performance for a student
export const updateAcademicPerformance = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const updateData = req.body;

    // Extract userId and academicPerformanceId from the request parameters
    const { studentId, academicPerformanceId } = req.params;

    // Call the service layer to handle the logic for updating academic performance details
    const updatedAcademicPerformance =
      await updateAcademicPerformanceForStudent(
        studentId,
        academicPerformanceId,
        updateData
      );

    // Respond to the client with the updated academic performance details
    return res.status(200).json({
      message: 'Academic performance details updated successfully',
      updatedAcademicPerformance,
    });
  } catch (error) {
    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
