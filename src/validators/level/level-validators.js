// src/validators/level/level-validators.js

import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';
import prisma from '../../../prismaClient.js';

// Factory function to generate validators for level creation
const createLevelValidators = () => ({
  // Validator for levels array
  validateLevels: body('levels')
    .isArray()
    .withMessage('Levels must be an array')
    .notEmpty()
    .withMessage('Levels array cannot be empty')
    .bail()
    .custom(async (levels) => {
      // Check each level object inside the array
      for (const [index, level] of levels.entries()) {
        if (!level.name || typeof level.name !== 'string') {
          throw new Error(
            `Level at index ${index} must have a valid 'name' as a string`
          );
        }
        if (level.name.length > 200) {
          throw new Error(
            `Level at index ${index} name should not exceed 200 characters`
          );
        }

        if (!level.code || typeof level.code !== 'string') {
          throw new Error(
            `Level at index ${index} must have a valid 'code' as a string`
          );
        }
        if (level.code.length > 50) {
          throw new Error(
            `Level at index ${index} code should not exceed 50 characters`
          );
        }

        // Check if the code already exists in the database
        try {
          const existingLevel = await prisma.level.findUnique({
            where: { code: level.code },
          });
          if (existingLevel) {
            throw new Error(
              `Level code "${level.code}" already exists at index ${index}`
            );
          }
        } catch (error) {
          throw new Error(
            `Unexpected error during code validation: ${error.message}`
          );
        }

        if (!level.description || typeof level.description !== 'string') {
          throw new Error(
            `Level at index ${index} must have a valid 'description' as a string`
          );
        }
        if (level.description.length > 500) {
          throw new Error(
            `Level at index ${index} description should not exceed 500 characters`
          );
        }

        if (level.order === undefined || typeof level.order !== 'number') {
          throw new Error(
            `Level at index ${index} must have a valid 'order' as a number`
          );
        }
      }
      return true;
    }),
});

// Factory function to generate validators specific to level update
const updateLevelValidators = () => ({
  // Validator for level update (using the generic validation function for name and code)
  validateLevelName: validateInput('name'),
  validateLevelCode: validateInput('code', { required: false }).custom(
    async (value, { req }) => {
      try {
        if (value) {
          const existingLevel = await prisma.level.findUnique({
            where: { code: value },
          });
          if (existingLevel && existingLevel.code !== value) {
            throw new Error(`A level with code "${value}" already exists.`);
          }
        }
      } catch (error) {
        throw new Error(
          `Unexpected error during code validation: ${error.message}`
        );
      }
    }
  ),
  validateLevelDescription: validateInput('description', { required: false }),
  validateLevelOrder: body('order')
    .optional()
    .isInt()
    .withMessage('Order must be an integer'),
});

// Generate all the level-specific validators using the factory function
const levelValidators = createLevelValidators();

const updateLevelValidatorsFunction = updateLevelValidators();

// Grouping all individual validators into one array for ease of use in middleware
// This array is later used in the level creation route for validation
export const levelCreationValidators = Object.values(levelValidators);

export const levelUpdateValidators = Object.values(
  updateLevelValidatorsFunction
);
