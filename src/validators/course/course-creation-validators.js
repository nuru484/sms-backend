// src/validators/course/course-creation-validators.js

import { body } from 'express-validator';

// Factory function to generate validators specific to course creation
const createCourseValidators = () => ({
  // Validator for course/courses
  validateCourses: body('courses')
    .isArray()
    .withMessage('Courses must be an array')
    .notEmpty()
    .withMessage('Courses array cannot be empty')
    .bail()
    .custom((courses) => {
      // Check each course object inside the array
      courses.forEach((course, index) => {
        if (!course.name || typeof course.name !== 'string') {
          throw new Error(
            `Course at index ${index} must have a valid 'name' as a string`
          );
        }
        if (course.name.length > 200) {
          throw new Error(
            `Course at index ${index} name should not exceed 200 characters`
          );
        }

        if (!course.code || typeof course.code !== 'string') {
          throw new Error(
            `Course at index ${index} must have a valid 'code' as a string`
          );
        }
        if (course.code.length > 50) {
          throw new Error(
            `Course at index ${index} code should not exceed 50 characters`
          );
        }
      });
      return true;
    }),
});

// Generate all the course-specific validators using the factory function
const courseValidators = createCourseValidators();

// Grouping all individual validators into one array for ease of use in middleware
// This array is later used in the course creation route for validation
export const courseCreationValidators = Object.values(courseValidators);
