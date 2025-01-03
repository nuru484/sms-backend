// src/controllers/academicCalendar/academic-calendar-controller.js
import {
  processCreateAcademicCalendar,
  processUpdateAcademicCalendar,
  processGetAcademicCalendarById,
  processGetAcademicCalendars,
  processRemoveAcademicCalendarById,
  processRemoveAllAcademicCalendars,
} from '../../services/academicCalendar/academic-calendar-services.js';
import sendSMS from '../../config/arkselApi.js';

/**
 * Controller function to handle academic calendar creation.
 *
 * @param {Object} req - Express request object containing the academic calendar data in `req.body`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 201 Created response with the result of the academic calendar creation,
 * or forwards the error to centralized error handling middleware.
 */
export const handleCreateAcademicCalendar = async (req, res, next) => {
  const calendarData = req.body;

  try {
    const result = await processCreateAcademicCalendar(calendarData);

    res.status(201).json({
      message: 'Academic calendar created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to handle academic calendar updates.
 *
 * @param {Object} req - Express request object containing calendar data in `req.body` and `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the result of the calendar update,
 * or forwards the error to centralized error handling middleware.
 */
export const handleUpdateAcademicCalendar = async (req, res, next) => {
  const { calendarId } = req.params; // Extract calendar ID from request parameters
  const updateData = req.body; // Extract update data from request body

  try {
    const updatedCalendar = await processUpdateAcademicCalendar(
      calendarId,
      updateData
    );

    res.status(200).json({
      message: 'Academic calendar updated successfully',
      data: updatedCalendar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a single academic calendar by ID.
 */
export const handleGetAcademicCalendarById = async (req, res, next) => {
  const { calendarId } = req.params;

  try {
    const calendar = await processGetAcademicCalendarById(calendarId);

    res.status(200).json({
      message: 'Academic calendar fetched successfully',
      data: calendar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch all academic calendars with pagination and search.
 */
export const handleGetAcademicCalendars = async (req, res, next) => {
  try {
    const { page, limit, fetchAll, searchQuery } = req.query;

    const options = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      fetchAll: fetchAll ? fetchAll === 'true' : undefined,
      searchQuery: searchQuery ? searchQuery : undefined,
    };

    const result = await processGetAcademicCalendars(options);

    res.status(200).json({
      message: 'Academic calendars fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single academic calendar by ID.
 */
export const handleDeleteAcademicCalendarById = async (req, res, next) => {
  const { calendarId } = req.params;

  try {
    const deletedCalendar = await processRemoveAcademicCalendarById(calendarId);

    res.status(200).json({
      message: 'Academic calendar deleted successfully',
      data: deletedCalendar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete all academic calendars.
 */
export const handleDeleteAllAcademicCalendars = async (req, res, next) => {
  try {
    const deletedCount = await processRemoveAllAcademicCalendars();

    res.status(200).json({
      message: `${deletedCount} academic calendars deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
