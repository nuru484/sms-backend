import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';

// Factory function to generate validators for AcademicPerformance model
const createAcademicPerformanceValidators = () => ({
  // Validator for previousGrade (optional, max length 100 characters)
  validatePreviousGrade: validateInput('previousGrade', {
    required: false,
    maxLength: 100,
  }),

  // Validator for promotionStatus (optional, max length 50 characters)
  validatePromotionStatus: validateInput('promotionStatus', {
    required: false,
    maxLength: 50,
  }),

  // Validator for courses (optional, must be a valid object)
  validateCourses: body('courses')
    .optional()
    .custom((value) => {
      if (
        typeof value !== 'object' || // Check if value is not an object
        value === null || // Exclude null values
        Array.isArray(value) // Exclude arrays
      ) {
        throw new Error('Courses must be a valid JSON object.');
      }
      return true; // Validation passed
    }),

  // Validator for grades (optional, must be a valid object)
  validateGrades: body('grades')
    .optional()
    .custom((value) => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error('Grades must be a valid JSON object.');
      }
      return true;
    }),

  // Validator for classRanking (optional, max length 50 characters)
  validateClassRanking: validateInput('classRanking', {
    required: false,
    maxLength: 50,
  }),

  // Validator for specialPrograms (optional, must be a valid array)
  validateSpecialPrograms: body('specialPrograms')
    .optional()
    .custom((value) => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new Error('Special programs must be a valid JSON array.');
      }
      return true;
    }),
});

// Generate validators using the factory function
const academicPerformanceValidators = createAcademicPerformanceValidators();

// Group validators into an array for middleware usage
export const academicPerformanceValidationMiddleware = Object.values(
  academicPerformanceValidators
);
