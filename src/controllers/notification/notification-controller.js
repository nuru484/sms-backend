// src/controllers/notification/notification-controller.js
import {
  processGetNotificationById,
  processGetUserNotifications,
  processRemoveNotificationById,
  processRemoveAllUserNotifications,
} from '../../services/notification/notification-services.js';

/**
 * Controller function to fetch a single notification by ID.
 *
 * @param {Object} req - Express request object containing the notification ID in `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the notification data,
 * or forwards the error to centralized error handling middleware.
 */
export const handleGetNotificationById = async (req, res, next) => {
  const { notificationId } = req.params;

  try {
    const notification = await processGetNotificationById(notificationId);

    res.status(200).json({
      message: 'Notification fetched successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to fetch all notifications for a specific user with pagination and optional filtering.
 *
 * @param {Object} req - Express request object containing query parameters for pagination and filtering.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the list of notifications for the user,
 * or forwards the error to centralized error handling middleware.
 */
export const handleGetUserNotifications = async (req, res, next) => {
  const { userId } = req.params; // Extract userId from the request parameters
  const { page, limit, status, read, optIn } = req.query; // Extract query parameters

  const options = {
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
    status: status || undefined,
    read: read ? read === 'true' : undefined,
    optIn: optIn ? optIn === 'true' : undefined,
  };

  try {
    const result = await processGetUserNotifications(userId, options);

    res.status(200).json({
      message: 'User notifications fetched successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to delete a single notification by ID.
 *
 * @param {Object} req - Express request object containing the notification ID in `req.params.id`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response indicating the notification was deleted,
 * or forwards the error to centralized error handling middleware.
 */
export const handleDeleteNotificationById = async (req, res, next) => {
  const { notificationId } = req.params;

  try {
    const notification = await processRemoveNotificationById(notificationId);

    res.status(200).json({
      message: 'Notification deleted successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller function to delete all notifications for a specific user.
 *
 * @param {Object} req - Express request object containing the user ID in `req.params.userId`.
 * @param {Object} res - Express response object used to send the response back to the client.
 * @param {Function} next - Express middleware function to pass control to the next middleware in case of an error.
 *
 * @returns {Promise<void>} - Sends a 200 OK response with the count of notifications deleted,
 * or forwards the error to centralized error handling middleware.
 */
export const handleDeleteAllUserNotifications = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const deletedCount = await processRemoveAllUserNotifications(userId);

    res.status(200).json({
      message: `${deletedCount} notifications deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
