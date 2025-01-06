// src/services/notification/notification-services.js

import {
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

const BATCH_SIZE = 100; // Batch size for processing

export const processCreateNotification = async (notificationData) => {
  const { userIds, subject, message } = notificationData;

  try {
    // Divide userIds into batches
    const userBatches = [];
    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      userBatches.push(userIds.slice(i, i + BATCH_SIZE));
    }

    for (const batch of userBatches) {
      // Prefetch user data in a single query
      const users = await Promise.all(
        batch.map(async (userId) => {
          const cacheKey = `user:${userId}`;
          const cachedData = await client.get(cacheKey);

          if (cachedData) {
            return JSON.parse(cachedData);
          } else {
            const user = await prisma.user.findUnique({
              where: { id: parseInt(userId, 10) },
              select: {
                id: true,
                phoneNumber: true,
                email: true,
                notificationChannel: true,
              },
            });
            if (user) {
              await client.set(cacheKey, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
            }
            return user;
          }
        })
      );

      // Filter out invalid or missing users
      const validUsers = users.filter((user) => user);

      // Mapping for notification channels
      const channelHandlers = {
        SMS: async (user) => {
          const normalizedPhoneNumber = normalizePhoneNumber(user.phoneNumber);
          const response = await sendSMS({
            message,
            recipients: [normalizedPhoneNumber],
          });
          return { status: response.status, error: null };
        },
        EMAIL: async (user) => {
          try {
            await transporter.sendMail({
              from: '"Notification Service" <notifications@example.com>',
              to: user.email,
              subject,
              text: message,
            });
            return { status: 'success', error: null };
          } catch (error) {
            logger.error(
              `Failed to send email to user ${user.id}: ${error.message}`
            );
            return { status: 'failed', error: error.message };
          }
        },
        PUSH: async (user) => {
          const response = await sendPushNotification({
            userId: user.id,
            title: subject,
            body: message,
          });
          return { status: response.status, error: null };
        },
      };

      const notificationResults = await Promise.allSettled(
        validUsers.map(async (user) => {
          try {
            if (!channelHandlers[user.notificationChannel]) {
              throw new CustomError(
                500,
                `Unsupported notification channel: ${user.notificationChannel}`
              );
            }

            const { status, error } = await channelHandlers[
              user.notificationChannel
            ](user);

            return {
              message,
              subject,
              userId: user.id,
              type: user.notificationChannel,
              status,
              error,
            };
          } catch (error) {
            handlePrismaError(error, 'Notification');
          }
        })
      );

      const notifications = notificationResults
        .map((result) => (result.status === 'fulfilled' ? result.value : null))
        .filter(Boolean);

      // Bulk insert notifications
      if (notifications.length > 0) {
        await prisma.notification.createMany({ data: notifications });
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
