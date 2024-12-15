// src/controllers/studentFormerSchool/health-support-controller.js

import {
  createHealthAndSupportForStudent,
  updateHealthAndSupportForStudent,
} from '../../services/studentFormerSchool/health-support-services.js';

import logger from '../../utils/logger.js'; // Logger utility for structured logging

// ################################################################################################

// Controller to handle the creation of health and support details for a student
export const createHealthAndSupport = async (req, res, next) => {
  try {
    // Extract userId and formerSchoolId from the request parameters
    const { studentId, formerSchoolId } = req.params;

    // Extract required data from the request body
    const healthAndSupportData = req.body;

    healthAndSupportData.formerSchoolId = formerSchoolId;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to create health and support details at controller layer': {
        studentId,
        healthAndSupportData: req.body,
      },
    });

    // Call the service layer to handle the logic for creating health and support details
    const healthAndSupport = await createHealthAndSupportForStudent(
      studentId,
      formerSchoolId,
      healthAndSupportData
    );

    // Log the successful transaction
    logger.info({
      'Health and support details successfully created at controller layer': {
        healthAndSupportId: healthAndSupport.id,
      },
    });

    // Respond to the client with the created health and support details
    return res.status(201).json({
      message: 'Health and support details created successfully',
      healthAndSupport,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in createHealthAndSupport controller': {
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

// Controller to handle the update of health and support details for a student
export const updateHealthAndSupport = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const updateData = req.body;

    // Extract userId and healthAndSupportId from the request parameters
    const { studentId, healthAndSupportId } = req.params;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to update health and support details at controller layer': {
        studentId,
        healthAndSupportId,
        updateData,
      },
    });

    // Call the service layer to handle the logic for updating health and support details
    const updatedHealthAndSupport = await updateHealthAndSupportForStudent(
      studentId,
      healthAndSupportId,
      updateData
    );

    // Log the successful transaction
    logger.info({
      'Health and support details successfully updated at controller layer': {
        healthAndSupportId: updatedHealthAndSupport.id,
      },
    });

    // Respond to the client with the updated health and support details
    return res.status(200).json({
      message: 'Health and support details updated successfully',
      updatedHealthAndSupport,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in updateHealthAndSupport controller': {
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
