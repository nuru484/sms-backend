import {
  fetchNotificationById,
  fetchUserNotifications,
  deleteNotificationById,
  deleteAllUserNotifications,
} from '../../repositories/notification/notification-repository.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';

/**
 * Service function to fetch a single notification by its ID.
 *
 * @param {number} notificationId - The ID of the notification to fetch.
 * @returns {Promise<Object>} - Returns the notification object.
 * @throws {CustomError} - Throws an error if the notification is not found.
 */
export const processGetNotificationById = async (notificationId) => {
  try {
    const notification = await fetchNotificationById(notificationId);

    if (!notification) {
      throw new CustomError(
        404,
        `Notification with ID ${notificationId} not found.`
      );
    }

    // Cache the notification data
    const notificationCacheKey = `notification:${notificationId}`;
    saveToCache(notificationCacheKey, { data: notification });

    return notification;
  } catch (error) {
    handlePrismaError(error, 'Notification');
  }
};

/**
 * Service function to fetch all notifications for a specific user with pagination and optional filtering.
 *
 * @param {number} userId - The ID of the user whose notifications are being fetched.
 * @param {Object} options - Query parameters (page, limit, status, read, optIn).
 * @returns {Promise<Object>} - Returns an object containing notifications and pagination info.
 * @throws {CustomError} - Throws an error if no notifications are found.
 */
export const processGetUserNotifications = async (userId, options) => {
  try {
    const response = await fetchUserNotifications(userId, options);

    if (!response || response.data.length === 0) {
      throw new CustomError(
        404,
        `No notifications found for user with ID ${userId}.`
      );
    }

    // Cache the user notifications data
    const notificationsCacheKey = `notifications:user:${userId}${JSON.stringify(
      options
    )}`;

    saveToCache(notificationsCacheKey, response);

    return response;
  } catch (error) {
    handlePrismaError(error, 'Notification');
  }
};

/**
 * Service function to delete a single notification by its ID.
 *
 * @param {number} notificationId - The ID of the notification to delete.
 * @returns {Promise<Object>} - Returns the deleted notification object.
 * @throws {CustomError} - Throws an error if the deletion fails.
 */
export const processRemoveNotificationById = async (notificationId) => {
  try {
    const deletedNotification = await deleteNotificationById(notificationId);

    const userId = deletedNotification.userId;

    const patterns = [
      `notification:${notificationId}`,
      `notifications:user:${userId}*`,
    ];
    await invalidateCache(client, patterns);

    return;
  } catch (error) {
    handlePrismaError(error, 'Notification');
  }
};

/**
 * Service function to delete all notifications for a specific user.
 *
 * @param {number} userId - The ID of the user whose notifications need to be deleted.
 * @returns {Promise<number>} - Returns the count of deleted notifications.
 * @throws {CustomError} - Throws an error if there are no notifications to delete.
 */
export const processRemoveAllUserNotifications = async (userId) => {
  try {
    const patterns = [`notification:*`, `notifications:user:${userId}*`];
    await invalidateCache(client, patterns);

    return await deleteAllUserNotifications(userId);
  } catch (error) {
    handlePrismaError(error, 'Notification');
  }
};
