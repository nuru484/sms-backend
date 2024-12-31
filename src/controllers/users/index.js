import {
  handleGetAllStudents,
  handleGetStudentById,
  handleDeleteStudentById,
  handleDeleteAllStudents,
} from './student-controller.js';
import {
  handleGetAllTeachers,
  handleGetTeacherById,
  handleDeleteTeacherById,
  handleDeleteAllTeachers,
} from './teacher-controller.js';
import { forgetPassword, resetPassword } from './general-user-controller.js';

export {
  handleGetAllStudents,
  handleGetStudentById,
  handleDeleteStudentById,
  handleDeleteAllStudents,
  handleGetAllTeachers,
  handleGetTeacherById,
  handleDeleteTeacherById,
  handleDeleteAllTeachers,
  forgetPassword,
  resetPassword,
};
