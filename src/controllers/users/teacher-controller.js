// src/controllers/users/teacher-controller.js
import {
  getAllTeachers,
  getSingleTeacherById,
  removeTeacherById,
  removeAllTeachers,
} from '../../services/users/teacher-services.js';

/**
 * Controller to fetch all teachers with pagination and search.
 */
export const handleGetAllTeachers = async (req, res, next) => {
  try {
    const { page, limit, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const result = await getAllTeachers(options);

    res.status(200).json({
      message: 'Teachers fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single teacher by ID.
 */
export const handleGetTeacherById = async (req, res, next) => {
  const { teacherId } = req.params;

  try {
    const teacher = await getSingleTeacherById(teacherId);

    res.status(200).json({
      message: 'Teacher fetched successfully',
      teacher,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single teacher by ID.
 */
export const handleDeleteTeacherById = async (req, res, next) => {
  const { teacherId } = req.params;

  try {
    const deletedTeacher = await removeTeacherById(teacherId);

    res.status(200).json({
      message: 'Teacher deleted successfully',
      deletedTeacher,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all teachers.
 */
export const handleDeleteAllTeachers = async (req, res, next) => {
  try {
    const result = await removeAllTeachers();

    res.status(200).json({
      message: 'All teachers deleted successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};
