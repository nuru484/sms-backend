// src/validators/studentFormerSchool/academic-perfomance-validators.js
import {
  validateArray,
  validateInput,
  validateObject,
} from '../general-validators.js';

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

  validateCourses: validateArray('courses'),

  // Validator for grades (optional, must be a valid object)
  validateGrades: validateObject('grades'),

  // Validator for classRanking (optional, max length 50 characters)
  validateClassRanking: validateInput('classRanking', {
    required: false,
    maxLength: 50,
  }),

  // Validator for specialPrograms (optional, must be a valid array)
  validateSpecialPrograms: validateArray('specialPrograms'),
});

// Group validators into an array for middleware usage
export const academicPerformanceValidationMiddleware = Object.values(
  createAcademicPerformanceValidators()
);
