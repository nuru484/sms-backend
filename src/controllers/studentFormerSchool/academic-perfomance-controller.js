// src/controllers/studentFormerSchool/academic-perfomance-controller.js

import {
  createAcademicPerformanceForStudent,
  updateAcademicPerformanceForStudent,
} from '../../services/studentFormerSchool/academic-perfomance-services.js';

import logger from '../../utils/logger.js'; // Logger utility for structured logging

// ################################################################################################

// Controller to handle the creation of academic performance for a student
export const createAcademicPerformance = async (req, res, next) => {
  try {
    // Extract userId from the request parameters
    const { studentId, formerSchoolId } = req.params;

    // Extract required data from the request body
    const academicPerformanceData = req.body;

    academicPerformanceData.formerSchoolId = formerSchoolId;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to create academic performance details at controller layer': {
        studentId,
        academicPerformanceData: req.body,
      },
    });

    // Call the service layer to handle the logic for creating academic performance details
    const academicPerformance = await createAcademicPerformanceForStudent(
      studentId,
      formerSchoolId,
      academicPerformanceData
    );

    // Log the successful transaction
    logger.info({
      'Academic performance details successfully created at controller layer': {
        academicPerformanceId: academicPerformance.id,
      },
    });

    // Respond to the client with the created academic performance details
    return res.status(201).json({
      message: 'Academic performance details created successfully',
      academicPerformance,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in createAcademicPerformance controller': {
        error: error.message,
        stack: error.stack,
        requestBody: req.body,
      },
    });

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

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to update academic performance details at controller layer': {
        studentId,
        academicPerformanceId,
        updateData,
      },
    });

    // Call the service layer to handle the logic for updating academic performance details
    const updatedAcademicPerformance =
      await updateAcademicPerformanceForStudent(
        studentId,
        academicPerformanceId,
        updateData
      );

    // Log the successful transaction
    logger.info({
      'Academic performance details successfully updated at controller layer': {
        academicPerformanceId: updatedAcademicPerformance.id,
      },
    });

    // Respond to the client with the updated academic performance details
    return res.status(200).json({
      message: 'Academic performance details updated successfully',
      updatedAcademicPerformance,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in updateAcademicPerformance controller': {
        error: error.message,
        stack: error.stack,
        requestBody: req.body,
        requestParams: req.params,
      },
    });

    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
