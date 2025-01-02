// src/validators/class/class-validators.js
import { validateInput, validateInteger } from '../general-validators.js';
import { body } from 'express-validator';

// Factory function to generate validators for class creation
const createClassValidators = () => ({
  validateClasses: body('classes')
    .isArray()
    .withMessage('Classes must be an array')
    .notEmpty()
    .withMessage('Classes array cannot be empty')
    .bail()
    .custom(async (classes) => {
      // Check each class object inside the array
      for (const [index, clazz] of classes.entries()) {
        // Validate `name`
        if (!clazz.name || typeof clazz.name !== 'string') {
          throw new Error(
            `Class at index ${index} must have a valid 'name' as a string`
          );
        }
        if (clazz.name.length > 255) {
          throw new Error(
            `Class at index ${index} name should not exceed 255 characters`
          );
        }

        // Validate `code`
        if (!clazz.code || typeof clazz.code !== 'string') {
          throw new Error(
            `Class at index ${index} must have a valid 'code' as a string`
          );
        }
        if (clazz.code.length > 50) {
          throw new Error(
            `Class at index ${index} code should not exceed 50 characters`
          );
        }

        // Validate `hall`
        if (clazz.hall && typeof clazz.hall !== 'string') {
          throw new Error(
            `Class at index ${index} must have a valid 'hall' as a string`
          );
        }
        if (clazz.hall && clazz.hall.length > 50) {
          throw new Error(
            `Class at index ${index} hall should not exceed 50 characters`
          );
        }

        // Validate `description`
        if (clazz.description && typeof clazz.description !== 'string') {
          throw new Error(
            `Class at index ${index} must have a valid 'description' as a string`
          );
        }
        if (clazz.description && clazz.description.length > 255) {
          throw new Error(
            `Class at index ${index} description should not exceed 255 characters`
          );
        }

        // Validate `roomNumber`
        if (clazz.roomNumber) {
          if (!Number.isInteger(clazz.roomNumber)) {
            throw new Error(
              `Class at index ${index} must have a valid 'roomNumber' as an integer`
            );
          }
          if (clazz.roomNumber.toString().length > 50) {
            throw new Error(
              `Class at index ${index} roomNumber should not exceed 50 characters`
            );
          }
        }
      }
      return true;
    }),
});

export const classCreationValidators = Object.values(createClassValidators());

// Factory function to generate validators specific to class update
const updateClassValidators = () => ({
  // Validator for class update fields
  validateClassName: validateInput('name', { required: false }),
  validateClassCode: validateInput('code', { required: false }),
  validateClassHall: validateInput('hall', { required: false }),
  validateClassDescription: validateInput('description', { required: false }),
  validateClassRoomNumber: validateInteger('roomNumber'),
});

export const classUpdateValidators = Object.values(updateClassValidators());
