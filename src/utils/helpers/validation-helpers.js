// src/helpers/validation-helpers.js
import prisma from '../../config/prismaClient.js';
import logger from '../logger.js';
import { CustomError } from '../middleware/errorHandler.js';

export const checkFieldUnique = async (fieldName, value, model = 'user') => {
  try {
    const existingRecord = await prisma[model].findUnique({
      where: { [fieldName]: value },
    });
    if (existingRecord) {
      return Promise.reject(
        `A record with the ${fieldName} "${value}" already exists in our database`
      );
    }
  } catch (error) {
    logger.error({
      [`Unexpected error during ${fieldName} validation`]: error.message,
    });
    return Promise.reject(
      `Unexpected error during ${fieldName} validation: ${error.message}`
    );
  }
};

export const checkFieldUniqueForUpdate = async (
  fieldName,
  value,
  currentRecordId,
  model = 'user'
) => {
  try {
    const existingRecord = await prisma[model].findUnique({
      where: { [fieldName]: value },
    });

    // Check if the found record is not the same as the one being updated
    if (existingRecord && existingRecord.id !== currentRecordId) {
      return Promise.reject(
        new CustomError(
          400,
          `The ${fieldName} "${value}" is already in use by another record.`
        )
      );
    }
  } catch (error) {
    // Add more descriptive logging for unexpected errors
    logger.error({
      [`Error during unique ${fieldName} validation for update`]: error.message,
      error,
      fieldName,
      value,
      currentRecordId,
      model,
    });

    return Promise.reject(
      new Error(
        `An unexpected error occurred during ${fieldName} validation: ${error.message}`
      )
    );
  }
};

/**
 * Validate multiple fields for uniqueness during an update.
 *
 * @param {Object} updateData - The object containing fields to update.
 * @param {Array<string>} fields - The list of fields to validate.
 * @param {number} currentRecordId - The ID of the record being updated.
 * @param {string} model - The database model to check against.
 * @returns {Promise<void>} - Resolves if all validations pass, otherwise rejects with an error.
 */
export const validateUniqueFieldsForUpdate = async (
  updateData,
  fields,
  currentRecordId,
  model
) => {
  const validationPromises = fields.map(async (field) => {
    if (updateData[field]) {
      await checkFieldUniqueForUpdate(
        field,
        updateData[field],
        currentRecordId,
        model
      );
    }
  });

  await Promise.all(validationPromises); // Wait for all validations to complete
};
