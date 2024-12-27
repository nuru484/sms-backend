// src/controllers/userRegistration/index.js

// Import of  the controller function responsible for handling student registration logic.
import {
  registerStudent,
  updateStudentBasicAndPersonal,
  updateParentBasicAndPersonal,
} from './student-registration-controller.js';

// Import of the controller function responsible for handling user registration logic.
import { registerUser } from './general-user-registration-controller.js';

// Import of  the controller function responsible for handling teacher registration logic.
import { registerTeacher } from './teacher-registration-controller.js';

/**
 * Export the user registration controller functions for students and admins.
 *
 * These exports make the registration functionalities accessible to other parts
 * of the application, enabling modular and reusable code design.
 */
export {
  registerStudent,
  updateStudentBasicAndPersonal,
  updateParentBasicAndPersonal,
  registerUser,
  registerTeacher,
};
