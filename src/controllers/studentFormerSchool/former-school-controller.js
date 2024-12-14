// src/controllers/studentFormerSchool/former-school-controller.js

import {
  createFormerSchoolForStudent,
  updateFormerSchoolForStudent,
} from '../../services/studentFormerSchool/former-school-services.js';
import logger from '../../utils/logger.js'; // Logger utility for structured logging

export const createFormerSchool = async (req, res, next) => {
  try {
    // Extract required data from the request body
    const formerSchoolData = req.body;

    // Extract userId from the request parameters
    const { studentId } = req.params;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to create former school details at controller layer': {
        studentId,
        formerSchoolData: req.body,
      },
    });

    // Call the service layer to handle the logic for creating former school details
    const formerSchool = await createFormerSchoolForStudent(
      studentId,
      formerSchoolData
    );

    // Log the successful transaction
    logger.info({
      'Former school details successfully created at controller layer': {
        formerSchoolId: formerSchool.id,
      },
    });

    // Respond to the client with the created former school details
    return res.status(201).json({
      message: 'Former school details created successfully',
      formerSchool,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in createFormerSchool controller': {
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

export const updateFormerSchool = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const updateData = req.body;

    // Extract userId and formerSchoolId from the request parameters
    const { studentId, formerSchoolId } = req.params;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to update former school details at controller layer': {
        studentId,
        formerSchoolId,
        updateData,
      },
    });

    // Call the service layer to handle the logic for updating former school details
    const updatedFormerSchool = await updateFormerSchoolForStudent(
      studentId,
      formerSchoolId,
      updateData
    );

    // Log the successful transaction
    logger.info({
      'Former school details successfully updated at controller layer': {
        formerSchoolId: updatedFormerSchool.id,
      },
    });

    // Respond to the client with the updated former school details
    return res.status(200).json({
      message: 'Former school details updated successfully',
      updatedFormerSchool,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in updateFormerSchool controller': {
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
