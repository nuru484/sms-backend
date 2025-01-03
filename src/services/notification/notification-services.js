import {
  createNotification,
  updateNotificationById,
  fetchNotificationById,
  fetchUserNotifications,
  deleteNotificationById,
  deleteAllUserNotifications,
} from '../../repositories/notification/notification-repository.js';
import { handlePrismaError } from '../../utils/prisma-error-handlers.js';
import { CustomError } from '../../utils/middleware/errorHandler.js';
import { saveToCache, client } from '../../config/redis.js';
import invalidateCache from '../../utils/helpers/invalidate-cache.js';
import sendSMS from '../../config/arkselApi.js';
import prisma from '../../config/prismaClient.js';
import logger from '../../utils/logger.js';
import normalizePhoneNumber from '../../utils/helpers/normalize-phone-numbers.js';
import transporter from '../../config/nodemailer.js';

/**
 * Service function to create a new notification.
 *
 * @param {Object} notificationData - The data to create the notification (e.g., type, message, userId, etc.).
 * @returns {Promise<Object>} - Returns the created notification object.
 * @throws {CustomError} - Throws an error if the creation fails.
 */
export const processCreateNotification = async (notificationData) => {
  try {
    const { userIds, subject, message } = notificationData;

    for (const userId of userIds) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: parseInt(userId, 10), // Ensure userId is properly matched with DB schema
          },
        });

        if (!user) {
          throw new CustomError(404, `User with ID ${userId} not found.`);
        }

        if (user.phoneNumber && user.notificationChannel === 'SMS') {
          const normalizedPhoneNumber = normalizePhoneNumber(user.phoneNumber);

          const response = await sendSMS({
            message,
            recipients: [normalizedPhoneNumber],
          });

          const notification = await createNotification({
            message,
            subject,
            userId, // Add userId explicitly here
            status: response.status,
          });

          // Invalidate cache for all notifications related to the user
          const patterns = [`notifications:user:${userId}*`];
          await invalidateCache(client, patterns);

          // Optionally log success for debugging purposes
          logger.info(`Notification created for user with ID ${userId}`);
        } else if (user.notificationChannel === 'EMAIL') {
          const info = transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to: user.email, // list of receivers
            subject, // Subject line
            text: message, // plain text body
          });

          const notification = await createNotification({
            message,
            subject,
            userId, // Add userId explicitly here
            status: response.status,
          });
        } else {
          logger.warn(`User with ID ${userId} has no phoneNumber or email.`);
        }
      } catch (error) {
        handlePrismaError(error, 'Notification');
      }
    }
  } catch (error) {
    handlePrismaError(error, 'Notification');
  }
};

/**
 * Service function to update a notification by its ID.
 *
 * @param {number} notificationId - The ID of the notification to update.
 * @param {Object} updateData - Object containing the fields to update.
 * @returns {Promise<Object>} - Returns the updated notification object.
 * @throws {CustomError} - Throws an error if the update fails.
 */
export const processUpdateNotification = async (notificationId, updateData) => {
  try {
    const updatedNotification = await updateNotificationById(
      notificationId,
      updateData
    );

    // Invalidate the cache for this specific notification and related user notifications
    const userId = updatedNotification.userId;
    const patterns = [
      `notification:${notificationId}`,
      `notifications:user:${userId}*`,
    ];
    await invalidateCache(client, patterns);

    return updatedNotification;
  } catch (error) {
    handlePrismaError(error, 'Notification');
  }
};

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
