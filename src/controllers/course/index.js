// src/controllers/course/index.js

// Import of  the controller functions in the course directory
import {
  handleCourseCreation,
  handleCourseUpdate,
  handleGetCourseById,
  handleGetCourses,
  handleDeleteCourseById,
  handleDeleteAllCourses,
} from './course-controller.js';

/**
 * Export the course  controller functions.
 *
 * These exports make the registration functionalities accessible to other parts
 * of the application, enabling modular and reusable code design.
 */
export {
  handleCourseCreation,
  handleCourseUpdate,
  handleGetCourseById,
  handleGetCourses,
  handleDeleteCourseById,
  handleDeleteAllCourses,
};
