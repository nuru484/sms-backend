// src/validators/studentFormerSchool/academic-perfomance-validators.js

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

  // Validator for courses (optional, must be a valid JSON array)
  validateCourses: body('courses')
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error('Courses must be a valid JSON array.');
        }
        return true;
      } catch (error) {
        throw new Error('Courses must be a valid JSON array.');
      }
    }),

  // Validator for grades (optional, must be a valid JSON object)
  validateGrades: body('grades')
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Grades must be a valid JSON object.');
        }
        return true;
      } catch (error) {
        throw new Error('Grades must be a valid JSON object.');
      }
    }),

  // Validator for classRanking (optional, max length 50 characters)
  validateClassRanking: validateInput('classRanking', {
    required: false,
    maxLength: 50,
  }),

  // Validator for specialPrograms (optional, must be a valid JSON array)
  validateSpecialPrograms: body('specialPrograms')
    .optional()
    .custom((value) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error('Special programs must be a valid JSON array.');
        }
        return true;
      } catch (error) {
        throw new Error('Special programs must be a valid JSON array.');
      }
    }),
});

// Generate validators using the factory function
const academicPerformanceValidators = createAcademicPerformanceValidators();

// Group validators into an array for middleware usage
export const academicPerformanceValidationMiddleware = Object.values(
  academicPerformanceValidators
);
