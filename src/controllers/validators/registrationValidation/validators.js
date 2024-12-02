import { body } from 'express-validator';
import prisma from '../../../../prismaClient';

export const validateFirstName = body(
  'firstName',
  'First name must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('First name is required!')
  .isLength({ max: 255 })
  .withMessage('First name must not exceed 255 characters.')
  .escape();

export const validateMiddleName = body(
  'middleName',
  'Middle name must be a string!'
)
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 255 })
  .withMessage('Middle name must not exceed 255 characters.')
  .escape();

export const validateLastName = body(
  'lastName',
  'Last name must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Last name is required!')
  .isLength({ max: 255 })
  .withMessage('Last name must not exceed 255 characters.')
  .escape();

export const validateGender = body(
  'gender',
  'Gender must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Gender is required!')
  .isLength({ max: 50 })
  .withMessage('Gender must not exceed 50 characters.')
  .escape();

export const validateProfilePhoto = body(
  'profilePhoto',
  'Profile photo must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Profile photo is required!')
  .isLength({ max: 255 })
  .withMessage('Profile photo must not exceed 255 characters.')
  .escape();

export const validateEmail = body(
  'email',
  'Email must be a valid email address!'
)
  .optional({ nullable: true })
  .trim()
  .isEmail()
  .withMessage('Invalid email address.')
  .isLength({ max: 255 })
  .withMessage('Email must not exceed 255 characters.')
  .escape()
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

export const validatePassword = body('password')
  .exists({ checkFalsy: true })
  .withMessage('You must type a password')
  .trim()
  .escape();

export const validateConfirmPassword = body('confirmPassword')
  .exists({ checkFalsy: true })
  .withMessage('You must type a confirmation password')
  .trim()
  .escape()
  .custom((value, { req }) => value === req.body.password)
  .withMessage('The passwords do not match');

export const validateDateOfBirth = body(
  'dateOfBirth',
  'Date of birth must be a valid date!'
)
  .notEmpty()
  .withMessage('Date of birth is required!')
  .isISO8601()
  .toDate();

export const validateEthnicity = body(
  'ethnicity',
  'Ethnicity must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Ethnicity is required!')
  .isLength({ max: 255 })
  .withMessage('Ethnicity must not exceed 255 characters.')
  .escape();

export const validatePreviousSchoolName = body(
  'previousSchoolName',
  'Previous school name must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Previous school name is required!')
  .escape();

export const validatePreviousSchoolLevel = body(
  'previousSchoolLevel',
  'Previous school level must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Previous school level is required!')
  .escape();

export const validateHireDate = body(
  'hireDate',
  'Hire date must be a valid date!'
)
  .notEmpty()
  .withMessage('Hire date is required!')
  .isISO8601()
  .toDate();

export const validatePhoneNumber = body(
  'phoneNumber',
  'Phone number must be a valid string!'
)
  .trim()
  .notEmpty()
  .withMessage('Phone number is required!')
  .isLength({ max: 15 })
  .withMessage('Phone number must not exceed 15 characters.')
  .escape();

export const validateCity = body('city', 'City must be a non-empty string!')
  .trim()
  .notEmpty()
  .withMessage('City is required!')
  .isLength({ max: 50 })
  .withMessage('City must not exceed 50 characters.')
  .escape();

export const validateCountry = body(
  'country',
  'Country must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Country is required!')
  .isLength({ max: 255 })
  .withMessage('Country must not exceed 255 characters.')
  .escape();

export const validateRegion = body(
  'region',
  'Region must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Region is required!')
  .isLength({ max: 50 })
  .withMessage('Region must not exceed 50 characters.')
  .escape();

export const validatePostalCode = body(
  'postalCode',
  'Postal code must be a valid string!'
)
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 255 })
  .withMessage('Postal code must not exceed 255 characters.')
  .escape();

export const validateDigitalAddress = body(
  'digitalAddress',
  'Digital address must be a non-empty string!'
)
  .trim()
  .notEmpty()
  .withMessage('Digital address is required!')
  .isLength({ max: 255 })
  .withMessage('Digital address must not exceed 255 characters.')
  .escape();
