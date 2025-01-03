// src/routes/notification/notification-routes.js
import { Router } from 'express';
const router = Router();

import {
  handleCreateNotification,
  handleUpdateNotification,
  handleGetNotificationById,
  handleGetUserNotifications,
  handleDeleteNotificationById,
  handleDeleteAllUserNotifications,
} from '../../controllers/notification/index.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const notificationCacheKey = (req) =>
  `notification:${req.params.notificationId}`;

const userNotificationsCacheKey = (req) => {
  const { userId } = req.params;
  const normalizedQuery = normalizeQuery(req.query);
  return `notifications:user:${userId}:${JSON.stringify(normalizedQuery)}`;
};

router.post(
  '/notification',
  authorizeRole(['ADMIN', 'TEACHER', 'STAFF']), // Middleware to authorize roles
  handleCreateNotification
);

router.put(
  '/notification/:notificationId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  handleUpdateNotification
);

// Route to fetch a single notification by ID
router.get(
  '/notification/:notificationId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(notificationCacheKey), // Middleware to handle caching
  handleGetNotificationById // Controller to fetch a single notification
);

// Route to fetch all notifications for a specific user
router.get(
  '/user/:userId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(userNotificationsCacheKey), // Middleware to handle caching
  handleGetUserNotifications // Controller to fetch all notifications for a user
);

// Route to delete a single notification by ID
router.delete(
  '/notification/:notificationId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  handleDeleteNotificationById // Controller to handle deletion by notification ID
);

// Route to delete all notifications for a specific user
router.delete(
  '/user/:userId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  handleDeleteAllUserNotifications // Controller to handle deletion of all notifications for a user
);

// Export the configured router to be used in the main application
export default router;
