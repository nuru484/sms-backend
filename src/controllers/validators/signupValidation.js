// Prisma client for database access
import prisma from '../../../prismaClient';

import { body } from 'express-validator';

/**
 * Validates the 'password' field in the request body.
 * Checks if the value meets strong password criteria.
 */
const validatePassword = () => {
  return body('password')
    .exists({ checkFalsy: true })
    .withMessage('You must type a password')
    .trim()
    .escape();
};

/**
 * Validates the 'password' field in the request body.
 * Checks if the value meets strong password criteria.
 */
const validateConfirmPassword = () => {
  return body('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('You must type a confirmation password')
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('The passwords do not match');
};

/**
 * Validates the 'email' field in the request body.
 * Checks if the value is a valid email format and if it's not already in use.
 * Sends an error message if the email is invalid or already in use.
 */

// Email validation
const validateEmail = () => {
  return body('email')
    .exists({ checkFalsy: true })
    .withMessage('You must type an email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Not a valid email address')
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: value },
      });
      if (existingUser) {
        throw new Error(
          `A user with the email "${value}" already exists in our database`
        );
      }
    });
};

/**
 * Validates the 'firstName' field in the request body.
 * Checks if the value is a non-empty string and trims and escapes it.
 * Sends an error message if the first name is empty.
 */
const validateFirstName = () => {
  return body('firstname').trim().isLength({ min: 1 }).escape();
};

/**
 * Validates the 'lastName' field in the request body.
 * Checks if the value is a non-empty string and trims and escapes it.
 * Sends an error message if the last name is empty.
 */
const validateLastName = () => {
  return body('lastname', 'Please enter your name!')
    .trim()
    .isLength({ min: 1 })
    .escape();
};

/**
 * Validates the 'dob' field in the request body.
 * Ensures the value is a valid date, not empty, and is in the past.
 * Sends an error message if the date is invalid or doesn't meet the criteria.
 */
const validateDOB = () => {
  return body('dob', 'Please enter a valid date of birth!')
    .trim() // Removes leading and trailing whitespaces
    .notEmpty()
    .withMessage('Date of birth is required!') // Ensures the field is not empty
    .isISO8601()
    .withMessage('Date of birth must be a valid date format (YYYY-MM-DD).') // Ensures the date is valid
    .isBefore(new Date().toISOString().split('T')[0])
    .withMessage('Date of birth must be in the past.') // Ensures the DOB is not in the future
    .escape(); // Sanitizes the input
};

/**
 * Validates the 'gender' field in the request body.
 * Ensures the value is one of the accepted options.
 * Sends an error message if the value is invalid or missing.
 */
const validateGender = () => {
  return body('gender', 'Please select a valid gender!')
    .trim()
    .notEmpty()
    .withMessage('Gender is required!')
    .isIn(['Male', 'Female', 'Non-Binary', 'Other'])
    .withMessage('Invalid gender selection.')
    .escape(); // Optional: Sanitizes the input
};

/**
 * Validates the 'ethnicity' field in the request body.
 * Ensures the value is a non-empty string and sanitizes the input.
 */
const validateEthnicity = () => {
  return body('ethnicity', 'Ethnicity must be a non-empty string!')
    .trim() // Remove extra whitespace
    .notEmpty()
    .withMessage('Ethnicity is required!') // Ensure it's not empty
    .isString()
    .withMessage('Ethnicity must be a valid string.') // Ensure the input is a string
    .isLength({ max: 50 })
    .withMessage('Ethnicity must not exceed 50 characters.') // Limit the length
    .escape(); // Sanitize input to prevent injection attacks
};

/**
 * Validates the 'phoneNumber' field in the request body.
 * Ensures the value is a valid phone number format.
 */
const validatePhoneNumber = () => {
  return body('phoneNumber', 'Please enter a valid phone number!')
    .trim() // Remove extra whitespace
    .notEmpty()
    .withMessage('Phone number is required!') // Ensure it's not empty
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Phone number must be a valid international format.') // Validate phone number format
    .isLength({ min: 7, max: 15 })
    .withMessage('Phone number must be between 7 and 15 digits.'); // Limit length
};

export {
  validatePassword,
  validateConfirmPassword,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateDOB,
  validateGender,
  validateEthnicity,
  validatePhoneNumber,
};
