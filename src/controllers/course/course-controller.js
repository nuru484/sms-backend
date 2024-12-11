// src/controllers/courseCreation/course-creation-controller.js
import { CustomError } from '../../utils/middleware/errorHandler.js';
import logger from '../../utils/logger.js'; // Logger for logging errors and information
import {
  createSingleCourse,
  createMultipleCourses,
  updateCourse,
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
      logger.info(`Creating multiple courses: ${courses.length} courses.`);
      result = await createMultipleCourses(courses);
    } else if (Array.isArray(courses) && courses.length === 1) {
      // Call the service for creating a single course
      logger.info('Creating a single course.');
      result = await createSingleCourse(courses[0]);
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
    // Log the error for debugging purposes
    logger.error({
      'Error during course creation': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

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
  const { id } = req.params; // Extract course ID from request parameters
  const updateData = req.body; // Extract course update data from request body

  try {
    // Validate the input
    if (!id) {
      throw new CustomError(400, 'Invalid input: "id" must be provided.');
    }

    // Log the update attempt
    logger.info({
      message: `Attempting to update course with ID: ${id}`,
      updateData,
    });

    // Call the service to update the course
    const updatedCourse = await updateCourse(Number(id), updateData);

    // Respond with success
    res.status(200).json({
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    // Log the error
    logger.error({
      'Error during course update': {
        errorMessage: error.message,
        errorStack: error.stack,
      },
    });

    // Forward the error to centralized error handling middleware
    next(error);
  }
};
