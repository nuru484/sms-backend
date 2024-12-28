import prisma from '../../config/prismaClient.js';
import { CustomError } from '../middleware/errorHandler.js';

/**
 * Checks if a value is unique in the database.
 * @param {string} modelName - The Prisma model name.
 * @param {string} fieldName - The field to check for uniqueness.
 * @param {any} value - The value to check.
 * @returns {Promise} - Resolves if the value is unique, rejects otherwise.
 */
export const checkUniqueness = async (modelName, fieldName, value) => {
  const existingRecord = await prisma[modelName].findUnique({
    where: { [fieldName]: value },
  });

  return new Promise((resolve, reject) => {
    if (existingRecord) {
      reject(new CustomError(409, `${fieldName} is already in use.`));
    } else {
      resolve();
    }
  });
};

/**
 * Checks if a value is unique in the database during an update operation.
 * @param {string} modelName - The Prisma model name.
 * @param {string} fieldName - The field to check for uniqueness.
 * @param {any} value - The value to check.
 * @param {any} currentId - The ID of the record being updated.
 * @returns {Promise} - Resolves if the value is unique or belongs to the current record, rejects otherwise.
 */
export const checkUniquenessOnUpdate = async (
  modelName,
  fieldName,
  value,
  currentId
) => {
  const existingRecord = await prisma[modelName].findUnique({
    where: { [fieldName]: value },
  });

  return new Promise((resolve, reject) => {
    if (existingRecord && existingRecord.id !== currentId) {
      reject(new CustomError(409, `${fieldName} is already in use.`));
    } else {
      resolve();
    }
  });
};
