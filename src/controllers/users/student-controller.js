// src/controllers/users/student-controller.js
import {
  getAllStudents,
  getStudentByIdService,
  removeStudentById,
  removeAllStudents,
} from '../../services/users/student-services.js';

/**
 * Controller to fetch all students with pagination and search.
 */
export const handleGetAllStudents = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: search ? search : undefined,
    };

    const result = await getAllStudents(options);

    res.status(200).json({
      message: 'Students fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single student by ID.
 */
export const handleGetStudentById = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const student = await getStudentByIdService(studentId);

    res.status(200).json({
      message: 'Student fetched successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single student by ID.
 */
export const handleDeleteStudentById = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const deletedStudent = await removeStudentById(studentId);

    res.status(200).json({
      message: 'Student deleted successfully',
      data: deletedStudent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all students.
 */
export const handleDeleteAllStudents = async (req, res, next) => {
  try {
    const result = await removeAllStudents();

    res.status(200).json({
      message: 'All students deleted successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};
