// src/repositories/notification/notification-repository.js
import prisma from '../../config/prismaClient.js'; // Prisma client for database operations
/**
 * Repository function to create a new notification.
 *
 * @param {Object} notificationData - The data to create the notification (e.g., type, message, etc.).
 * @returns {Promise<Object>} - Returns the created notification object if successful.
 * @throws {Error} - Throws an error if there's an issue during the creation process.
 */
export const createNotification = async (notificationData) => {
  try {
    const { userId, ...rest } = notificationData;
    const notification = await prisma.notification.create({
      data: {
        rest,
        user: {
          connect: {
            id: userId, // Connect to the user by userId
          },
        },
      },
    });

    return notification;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to update a notification by its ID.
 *
 * @param {number} notificationId - The ID of the notification to be updated.
 * @param {Object} updateData - The data to update (e.g., { read: true, status: 'SENT' }).
 * @returns {Promise<Object>} - Returns the updated notification object if successful.
 * @throws {Error} - Throws an error if the notification is not found or there's a database issue.
 */
export const updateNotificationById = async (notificationId, updateData) => {
  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(notificationId, 10) },
      data: updateData,
    });

    return updatedNotification;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch a single notification by its ID.
 *
 * @param {number} notificationId - The ID of the notification to fetch.
 * @returns {Promise<Object>} - Returns the notification object if found.
 * @throws {Error} - Throws an error if the notification is not found or there's a database issue.
 */
export const fetchNotificationById = async (notificationId) => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(notificationId, 10) },
    });

    return notification;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to fetch all notifications for a specific user with pagination and optional filtering.
 *
 * @param {Object} options - Query parameters (page, limit, status, read, optIn).
 * @returns {Promise<Object>} - Returns an object containing the notifications and pagination info.
 */
export const fetchUserNotifications = async (userId, options = {}) => {
  const { page = 1, limit = 10 } = options;

  try {
    const skip = (page - 1) * limit;

    const total = await prisma.notification.count({
      where: {
        userId: parseInt(userId, 10),
      },
    });

    const notifications = await prisma.notification.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Sort by creation date, latest first
      },
    });

    return {
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete a notification by its ID.
 *
 * @param {number} notificationId - The ID of the notification to delete.
 * @returns {Promise<Object>} - Returns the deleted notification object.
 * @throws {Error} - Throws an error if the notification is not found or there's a database issue.
 */
export const deleteNotificationById = async (notificationId) => {
  try {
    const deletedNotification = await prisma.notification.delete({
      where: { id: parseInt(notificationId, 10) },
    });

    return deletedNotification;
  } catch (error) {
    throw error;
  }
};

/**
 * Repository function to delete all notifications for a specific user.
 *
 * @param {number} userId - The ID of the user whose notifications need to be deleted.
 * @returns {Promise<number>} - Returns the count of deleted notifications.
 */
export const deleteAllUserNotifications = async (userId) => {
  try {
    const response = await prisma.notification.deleteMany({
      where: { userId: parseInt(userId, 10) },
    });

    return response.count; // Return the count of deleted notifications
  } catch (error) {
    throw error;
  }
};
