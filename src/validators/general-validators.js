// src/validators/general-validators.js
import { body } from 'express-validator';
import logger from '../utils/logger.js';
import prisma from '../config/prismaClient.js';

export const validateInput = (
  inputName,
  options = { maxLength: 255, required: true }
) => {
  const validation = body(
    inputName,
    `${inputName} must be a non-empty string!`
  ).trim();

  if (options.required) {
    validation.notEmpty().withMessage(`${inputName} is required!`);
  }

  validation
    .isLength({ max: options.maxLength })
    .withMessage(
      `${inputName} must not exceed ${options.maxLength} characters.`
    );

  return validation;
};

export const validateDateInput = (
  dateInputName,
  options = { required: true }
) => {
  const validation = body(
    dateInputName,
    `${dateInputName} must be a valid date!`
  );

  if (options.required) {
    validation.notEmpty().withMessage(`${dateInputName} is required!`);
  }

  validation.isISO8601().toDate();

  return validation;
};

export const validateEmailInput = (
  emailInputName,
  options = { maxLength: 255, required: true }
) => {
  const validation = body(
    emailInputName,
    `${emailInputName} must be a non-empty string!`
  );

  if (options.required) {
    validation.notEmpty().withMessage(`${emailInputName} is required!`);
  }

  validation
    .isLength({ max: options.maxLength })
    .withMessage(
      `${emailInputName} must not exceed ${options.maxLength} characters.`
    )
    .isEmail()
    .withMessage('Invalid email address.')
    .custom(async (value) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: value },
        });
        if (existingUser) {
          throw new Error(
            `A user with the email "${value}" already exists in our database`
          );
        }
      } catch (error) {
        logger.error({
          'Unexpected error during email validation': error.message,
        });

        throw new Error(
          `Unexpected error during email validation: ${error.message}`
        );
      }
    });

  return validation;
};

export const validatePassword = body('password')
  .exists({ checkFalsy: true })
  .withMessage('You must type a password')
  .isLength({ min: 4 })
  .withMessage('Password must be at least 4 characters long')
  // .matches(/[A-Z]/)
  // .withMessage('Password must contain at least one uppercase letter')
  // .matches(/[a-z]/)
  // .withMessage('Password must contain at least one lowercase letter')
  // .matches(/\d/)
  // .withMessage('Password must contain at least one number')
  // .matches(/[@$!%*?&#]/)
  // .withMessage('Password must contain at least one special character')
  .trim();

export const validateConfirmPassword = body('confirmPassword')
  .exists({ checkFalsy: true })
  .withMessage('You must type a confirmation password')
  .custom((value, { req }) => value === req.body.password)
  .withMessage('The passwords do not match')
  .trim();
