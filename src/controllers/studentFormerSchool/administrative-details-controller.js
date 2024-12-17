// src/controllers/studentFormerSchool/administrative-details-controller.js

import {
  createAdministrativeDetailsForStudent,
  updateAdministrativeDetailsForStudent,
} from '../../services/studentFormerSchool/administrative-details-services.js';
import upload from '../../config/multer.js';

// Controller to handle the creation of administrative details for a student
export const createAdministrativeDetails = [
  upload.fields([
    { name: 'transferCertificate' },
    { name: 'recommendationLetter' },
  ]), // Handle file uploads

  async (req, res, next) => {
    try {
      const { studentId, formerSchoolId } = req.params;
      const filesData = req.files; // Get files uploaded in the request

      const feesCleared = req.body.feesCleared === 'true'; // Extract other data from body and Converts 'true' to true and 'false' to false

      // Call the service to create the administrative details
      const administrativeDetails = await createAdministrativeDetailsForStudent(
        studentId,
        formerSchoolId,
        filesData,
        feesCleared
      );

      // Respond to the client
      return res.status(201).json({
        message: 'Administrative details created successfully',
        administrativeDetails,
      });
    } catch (error) {
      next(error); // Pass the error to next middleware
    }
  },
];

// Controller to handle the update of administrative details for a student
export const updateAdministrativeDetails = [
  upload.fields([
    { name: 'transferCertificate' },
    { name: 'recommendationLetter' },
  ]), // Handle file uploads

  async (req, res, next) => {
    try {
      const { studentId, administrativeDetailsId } = req.params;
      const feesCleared = req.body.feesCleared === 'true'; // Extract other data from body and Converts 'true' to true and 'false' to false
      const filesData = req.files; // Get files uploaded in the request

      const updateData = {
        feesCleared,
      };

      // Call the service to update the administrative details
      const updatedAdministrativeDetails =
        await updateAdministrativeDetailsForStudent(
          studentId,
          administrativeDetailsId,
          filesData,
          updateData
        );

      // Respond to the client
      return res.status(200).json({
        message: 'Administrative details updated successfully',
        updatedAdministrativeDetails,
      });
    } catch (error) {
      next(error); // Pass the error to next middleware
    }
  },
];
