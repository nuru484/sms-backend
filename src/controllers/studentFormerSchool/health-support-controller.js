// src/controllers/studentFormerSchool/health-support-controller.js

import {
  createHealthAndSupportForStudent,
  updateHealthAndSupportForStudent,
} from '../../services/studentFormerSchool/health-support-services.js';

// ################################################################################################

// Controller to handle the creation of health and support details for a student
export const createHealthAndSupport = async (req, res, next) => {
  try {
    // Extract userId and formerSchoolId from the request parameters
    const { studentId, formerSchoolId } = req.params;

    // Extract required data from the request body
    const healthAndSupportData = req.body;

    healthAndSupportData.formerSchoolId = formerSchoolId;

    // Call the service layer to handle the logic for creating health and support details
    const healthAndSupport = await createHealthAndSupportForStudent(
      studentId,
      formerSchoolId,
      healthAndSupportData
    );

    // Respond to the client with the created health and support details
    return res.status(201).json({
      message: 'Health and support details created successfully',
      healthAndSupport,
    });
  } catch (error) {
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

    // Call the service layer to handle the logic for updating health and support details
    const updatedHealthAndSupport = await updateHealthAndSupportForStudent(
      studentId,
      healthAndSupportId,
      updateData
    );

    // Respond to the client with the updated health and support details
    return res.status(200).json({
      message: 'Health and support details updated successfully',
      updatedHealthAndSupport,
    });
  } catch (error) {
    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
