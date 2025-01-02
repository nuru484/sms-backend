// src/routes/event/event-routes.js
import { Router } from 'express';
const router = Router();

import {
  handleCreateEvent,
  handleUpdateEvent,
  handleGetEventById,
  handleGetEvents,
  handleDeleteEventById,
  handleDeleteAllEvents,
} from '../../controllers/event/index.js';

import {
  validateEventDetails,
  validateEventUpdateDetails,
} from '../../validators/validationMiddleware/event/event-validation-middleware.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const eventCacheKey = (req) => `event:${req.params.eventId}`;
const eventsCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `events:${JSON.stringify(normalizedQuery)}`;
};

// Route to create an event
router.post(
  '/event',
  validateEventDetails,
  handleCreateEvent // Controller to handle creation logic
);

// Route to update an event by ID
router.put(
  '/event/:eventId',
  validateEventUpdateDetails,
  handleUpdateEvent // Controller to handle update logic
);

// Route to fetch a single event by ID
router.get(
  '/event/:eventId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(eventCacheKey), // Middleware to handle caching
  handleGetEventById // Controller to fetch a single event
);

// Route to fetch all events
router.get(
  '/',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(eventsCacheKey), // Middleware to handle caching
  handleGetEvents // Controller to fetch all events
);

// Route to delete an event by ID
router.delete(
  '/event/:eventId',
  handleDeleteEventById // Controller to handle deletion by ID
);

// Route to delete all events
router.delete(
  '/',
  handleDeleteAllEvents // Controller to handle deletion of all events
);

// Export the configured router to be used in the main application
export default router;
