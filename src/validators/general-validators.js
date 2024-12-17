// src/validators/general-validators.js
import { body } from 'express-validator';

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
  const validation = validateInput(emailInputName, options)
    .isEmail()
    .withMessage('Invalid email address.');
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
