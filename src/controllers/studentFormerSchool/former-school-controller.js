// src/controllers/studentFormerSchool/former-school-controller.js

import {
  createFormerSchoolForStudent,
  updateFormerSchoolForStudent,
} from '../../services/studentFormerSchool/former-school-services.js';

export const createFormerSchool = async (req, res, next) => {
  try {
    // Extract required data from the request body
    const formerSchoolData = req.body;

    // Extract userId from the request parameters
    const { studentId } = req.params;

    // Call the service layer to handle the logic for creating former school details
    const formerSchool = await createFormerSchoolForStudent(
      studentId,
      formerSchoolData
    );

    // Respond to the client with the created former school details
    return res.status(201).json({
      message: 'Former school details created successfully',
      formerSchool,
    });
  } catch (error) {
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

    // Call the service layer to handle the logic for updating former school details
    const updatedFormerSchool = await updateFormerSchoolForStudent(
      studentId,
      formerSchoolId,
      updateData
    );

    // Respond to the client with the updated former school details
    return res.status(200).json({
      message: 'Former school details updated successfully',
      updatedFormerSchool,
    });
  } catch (error) {
    // Pass the error to the next middleware for centralized error handling
    next(error);
  }
};
