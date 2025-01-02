// src/validators/course/course-validators.js
import { validateInput } from '../general-validators.js';
import { body } from 'express-validator';

// Factory function to generate validators  for course creation
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

        if (!course.description || typeof course.description !== 'string') {
          throw new Error(
            `Course at index ${index} must have a valid 'description' as a string.`
          );
        }
        if (course.description.length > 255) {
          throw new Error(
            `Course at index ${index} description should not exceed 255 characters.`
          );
        }
      });
      return true;
    }),
});

export const courseCreationValidators = Object.values(createCourseValidators());

// Factory function to generate validators specific to course update
const updateCourseValidators = () => ({
  // Validator for course update
  valdiateCourseName: validateInput('name', { required: false }),
  valdiateCourseCode: validateInput('code', { required: false }),
  valdiateCourseCode: validateInput('description', { required: false }),
});

export const courseUpdateValidators = Object.values(updateCourseValidators());
