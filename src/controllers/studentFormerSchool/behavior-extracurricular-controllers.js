import {
  createBehaviorAndExtracurricularForStudent,
  updateBehaviorAndExtracurricularForStudent,
} from '../../services/studentFormerSchool/behavior-extracurricular-services.js';

import logger from '../../utils/logger.js'; // Logger utility for structured logging

// ################################################################################################

// Controller to handle the creation of behavior and extracurricular details for a student
export const createBehaviorAndExtracurricular = async (req, res, next) => {
  try {
    // Extract userId and formerSchoolId from the request parameters
    const { studentId, formerSchoolId } = req.params;

    // Extract required data from the request body
    const behaviorAndExtracurricularData = req.body;

    behaviorAndExtracurricularData.formerSchoolId = formerSchoolId;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to create behavior and extracurricular details at controller layer':
        {
          studentId,
          behaviorAndExtracurricularData: req.body,
        },
    });

    // Call the service layer to handle the logic for creating behavior and extracurricular details
    const behaviorAndExtracurricular =
      await createBehaviorAndExtracurricularForStudent(
        studentId,
        formerSchoolId,
        behaviorAndExtracurricularData
      );

    // Log the successful transaction
    logger.info({
      'Behavior and extracurricular details successfully created at controller layer':
        {
          behaviorAndExtracurricularId: behaviorAndExtracurricular.id,
        },
    });

    // Respond to the client with the created behavior and extracurricular details
    return res.status(201).json({
      message: 'Behavior and extracurricular details created successfully',
      behaviorAndExtracurricular,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in createBehaviorAndExtracurricular controller': {
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

// Controller to handle the update of behavior and extracurricular details for a student
export const updateBehaviorAndExtracurricular = async (req, res, next) => {
  try {
    // Extract update data from the request body
    const updateData = req.body;

    // Extract userId and behaviorAndExtracurricularId from the request parameters
    const { studentId, behaviorAndExtracurricularId } = req.params;

    // Log the incoming request details for debugging and traceability
    logger.info({
      'Attempting to update behavior and extracurricular details at controller layer':
        {
          studentId,
          behaviorAndExtracurricularId,
          updateData,
        },
    });

    // Call the service layer to handle the logic for updating behavior and extracurricular details
    const updatedBehaviorAndExtracurricular =
      await updateBehaviorAndExtracurricularForStudent(
        studentId,
        behaviorAndExtracurricularId,
        updateData
      );

    // Log the successful transaction
    logger.info({
      'Behavior and extracurricular details successfully updated at controller layer':
        {
          behaviorAndExtracurricularId: updatedBehaviorAndExtracurricular.id,
        },
    });

    // Respond to the client with the updated behavior and extracurricular details
    return res.status(200).json({
      message: 'Behavior and extracurricular details updated successfully',
      updatedBehaviorAndExtracurricular,
    });
  } catch (error) {
    // Log the error details for debugging and monitoring
    logger.error({
      'Error in updateBehaviorAndExtracurricular controller': {
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
