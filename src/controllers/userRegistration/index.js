// src/controllers/userRegistration/index.js
import {
  registerStudent,
  updateStudentBasicAndPersonal,
  updateParentBasicAndPersonal,
} from './student-registration-controller.js';

// Import of the controller function responsible for handling user registration logic.
import { registerUser } from './general-user-registration-controller.js';

// Import of  the controller function responsible for handling teacher registration logic.
import {
  registerTeacher,
  updateTeacherDetailsController,
} from './teacher-registration-controller.js';

export {
  registerStudent,
  updateStudentBasicAndPersonal,
  updateParentBasicAndPersonal,
  registerUser,
  registerTeacher,
  updateTeacherDetailsController,
};
