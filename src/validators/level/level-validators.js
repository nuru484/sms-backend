// src/validators/level/level-validators.js
import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';

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

// Generate all the level-specific validators using the factory function
const levelValidators = createLevelValidators();
export const levelCreationValidators = Object.values(levelValidators);

// Factory function to generate validators specific to level update
const updateLevelValidators = () => ({
  // Validator for level update (using the generic validation function for name and code)
  validateLevelName: validateInput('name', { required: false }),
  validateLevelCode: validateInput('code', { required: false }),
  validateLevelDescription: validateInput('description', { required: false }),
  validateLevelOrder: body('order')
    .optional()
    .isInt()
    .withMessage('Order must be an integer'),
});

const updateLevelValidatorsFunction = updateLevelValidators();
export const levelUpdateValidators = Object.values(
  updateLevelValidatorsFunction
);
