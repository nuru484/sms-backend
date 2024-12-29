//  src/controllers/course/course-controller.js

import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js'; // Logger for logging errors and information
import {
  createSingleCourse,
  createMultipleCourses,
  updateCourse,
  getCourseById,
  getCourses,
  removeCourseById,
  removeAllCourses,
} from '../../services/course/course-services.js';

/**
 * Controller function to handle course creation.
 *
 * @param {Object} req - Express request object containing the course data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the course creation,
 * or forwards the error to centralized error handling middleware.
 */
export const handleCourseCreation = async (req, res, next) => {
  // Extract course data from the request body
  const { courses } = req.body;

  try {
    // Initialize a variable to store the response
    let result;

    // Check if the input is an array and decide whether to handle a single or multiple courses
    if (Array.isArray(courses) && courses.length > 1) {
      // Call the service for creating multiple courses
      result = await createMultipleCourses(courses);

      logger.info(`${courses.length} courses created successfully.`);
    } else if (Array.isArray(courses) && courses.length === 1) {
      // Call the service for creating a single course
      result = await createSingleCourse(courses[0]);

      logger.info('Course successfully created');
    } else {
      // If the input is invalid, throw an error
      throw new CustomError(400, 'Invalid input: "courses" must be an array.');
    }

    // Respond with success
    res.status(201).json({
      message: 'Course(s) created successfully',
      data: result,
    });
  } catch (error) {
    // Forward the error to centralized error handling middleware
    next(error);
  }
};

/**
 * Controller function to handle course updates.
 *
 * @param {Object} req - Express request object containing course data in `req.body` and `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the result of the course update,
 * or forwards the error to centralized error handling middleware.
 */
export const handleCourseUpdate = async (req, res, next) => {
  const { courseId } = req.params; // Extract course ID from request parameters
  const updateData = req.body; // Extract course update data from request body

  try {
    // Call the service to update the course
    const updatedCourse = await updateCourse(courseId, updateData);

    // Respond with success
    res.status(200).json({
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    // Forward the error to centralized error handling middleware
    next(error);
  }
};

/**
 * Controller to fetch a single course by ID.
 */
export const handleGetCourseById = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const course = await getCourseById(courseId);

    res
      .status(200)
      .json({ message: 'Course fetched successfully', data: course });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all courses with pagination and search.
 */
export const handleGetCourses = async (req, res, next) => {
  try {
    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll ? fetchAll === 'true' : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const result = await getCourses(options);
    res
      .status(200)
      .json({ message: 'Courses fetched successfully', data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single course by ID.
 */
export const handleDeleteCourseById = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const deletedCourse = await removeCourseById(courseId);
    res
      .status(200)
      .json({ message: 'Course deleted successfully', data: deletedCourse });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all courses.
 */
export const handleDeleteAllCourses = async (req, res, next) => {
  try {
    const deletedCount = await removeAllCourses();

    res
      .status(200)
      .json({ message: `${deletedCount} courses deleted successfully.` });
  } catch (error) {
    next(error);
  }
};
