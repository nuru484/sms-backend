// src/services/studentFormerSchool/administrative-details-services.js

import { getStudentByUserId } from '../../repositories/studentDetails/student-repository.js'; // To check student admission
import {
  createAdministrativeDetails,
  updateAdministrativeDetails,
  getAdministrativeDetailsById, // New repository function
} from '../../repositories/studentFormerSchool/administrative-details-repository.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js';
import { uploadFileToCloudinary } from '../../config/claudinary.js';
import { deleteFileFromCloudinary } from '../../config/claudinary.js';

// Function to create administrative details for a student
export const createAdministrativeDetailsForStudent = async (
  studentId,
  formerSchoolId,
  filesData,
  feesCleared
) => {
  try {
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot create administrative details.'
      );
    }

    const { transferCertificate, recommendationLetter } = filesData;

    const transferCertificateUrl = await uploadFileToCloudinary(
      transferCertificate[0]
    );
    const recommendationLetterUrl = await uploadFileToCloudinary(
      recommendationLetter[0]
    );

    const administrativeDetails = await createAdministrativeDetails({
      transferCertificateUrl,
      recommendationLetterUrl,
      feesCleared,
      formerSchoolId,
    });

    logger.info(
      `Administrative details successfully created for studentId: ${studentId}`
    );

    return administrativeDetails;
  } catch (error) {
    logger.error({
      'Error creating administrative details for student': {
        error: error.message,
        stack: error.stack,
      },
    });
    throw error;
  }
};

// Function to update administrative details for a student
export const updateAdministrativeDetailsForStudent = async (
  studentId,
  administrativeDetailsId,
  filesData,
  updateData
) => {
  try {
    const student = await getStudentByUserId(parseInt(studentId));

    if (!student) {
      throw new CustomError(404, 'Student not found');
    }

    if (student.admissionStatus !== 'ADMITTED') {
      throw new CustomError(
        400,
        'Student is not admitted. Cannot update administrative details.'
      );
    }

    // Fetch existing administrative details
    const administrativeDetails = await getAdministrativeDetailsById(
      administrativeDetailsId
    );

    if (!administrativeDetails) {
      throw new CustomError(404, 'Administrative details not found');
    }

    // Upload new files to Cloudinary if provided
    if (filesData.transferCertificate) {
      const transferCertificateUrl = await uploadFileToCloudinary(
        filesData.transferCertificate[0]
      );
      updateData.transferCertificate = transferCertificateUrl;
    }

    if (filesData.recommendationLetter) {
      const recommendationLetterUrl = await uploadFileToCloudinary(
        filesData.recommendationLetter[0]
      );
      updateData.recommendationLetter = recommendationLetterUrl;
    }

    // Delete old files from Cloudinary
    if (administrativeDetails.transferCertificate) {
      await deleteFileFromCloudinary(administrativeDetails.transferCertificate);
    }

    if (administrativeDetails.recommendationLetter) {
      await deleteFileFromCloudinary(
        administrativeDetails.recommendationLetter
      );
    }

    const updatedAdministrativeDetails = await updateAdministrativeDetails(
      administrativeDetailsId,
      updateData
    );

    logger.info(
      `Administrative details successfully updated for studentId: ${studentId}`
    );

    return updatedAdministrativeDetails;
  } catch (error) {
    logger.error({
      'Error updating administrative details for student': {
        error: error.message,
        stack: error.stack,
      },
    });
    throw error;
  }
};
