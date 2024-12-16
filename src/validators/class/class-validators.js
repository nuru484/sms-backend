// src/validators/class/class-validators.js

import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';
import prisma from '../../config/prismaClient.js';

// Factory function to generate validators for class creation
const createClassValidators = () => ({
  // Validator for classes array
  validateClasses: body('classes')
    .isArray()
    .withMessage('Classes must be an array')
    .notEmpty()
    .withMessage('Classes array cannot be empty')
    .bail()
    .custom(async (classes) => {
      // Check each class object inside the array
      for (const [index, clazz] of classes.entries()) {
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

        // Check if the code already exists in the database
        try {
          const existingClass = await prisma.class.findUnique({
            where: { code: clazz.code },
          });
          if (existingClass) {
            throw new Error(
              `Class code "${clazz.code}" already exists at index ${index}`
            );
          }
        } catch (error) {
          throw new Error(
            `Unexpected error during code validation: ${error.message}`
          );
        }

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

        if (clazz.roomNumber) {
          // Check if the roomNumber is an integer
          if (!Number.isInteger(clazz.roomNumber)) {
            throw new Error(
              `Class at index ${index} must have a valid 'roomNumber' as an integer`
            );
          }

          // Check if roomNumber exceeds 50 characters (or digits, in this case)
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

// Factory function to generate validators specific to class update
const updateClassValidators = () => ({
  // Validator for class update fields
  validateClassName: validateInput('name'),
  validateClassCode: validateInput('code', { required: false }).custom(
    async (value, { req }) => {
      try {
        if (value) {
          const existingClass = await prisma.class.findUnique({
            where: { code: value },
          });
          if (existingClass && existingClass.code !== value) {
            throw new Error(`A class with code "${value}" already exists.`);
          }
        }
      } catch (error) {
        throw new Error(
          `Unexpected error during code validation: ${error.message}`
        );
      }
    }
  ),
  validateClassHall: validateInput('hall', { required: false }),
  validateClassDescription: validateInput('description', { required: false }),
  validateClassRoomNumber: body('roomNumber')
    .isInt()
    .withMessage('Room number must be an integer'),
});

// Generate all the class-specific validators using the factory function
const classValidators = createClassValidators();

const updateClassValidatorsFunction = updateClassValidators();

// Grouping all individual validators into one array for ease of use in middleware
// This array is later used in the class creation route for validation
export const classCreationValidators = Object.values(classValidators);

export const classUpdateValidators = Object.values(
  updateClassValidatorsFunction
);
