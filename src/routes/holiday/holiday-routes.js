import { Router } from 'express';
const router = Router();

import {
  handleCreateHoliday,
  handleUpdateHoliday,
  handleGetHolidayById,
  handleGetHolidays,
  handleDeleteHolidayById,
  handleDeleteAllHolidays,
} from '../../controllers/holiday/index.js';

import {
  validateHolidayDetails,
  validateHolidayUpdateDetails,
} from '../../validators/validationMiddleware/holiday/holiday-validation-middleware.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const holidayCacheKey = (req) => `holiday:${req.params.holidayId}`;
const holidaysCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `holidays:${JSON.stringify(normalizedQuery)}`;
};

// Route to create a holiday
router.post(
  '/holiday',
  validateHolidayDetails,
  handleCreateHoliday // Controller to handle creation logic
);

// Route to update a holiday by ID
router.put(
  '/holiday/:holidayId',
  validateHolidayUpdateDetails,
  handleUpdateHoliday // Controller to handle update logic
);

// Route to fetch a single holiday by ID
router.get(
  '/holiday/:holidayId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(holidayCacheKey), // Middleware to handle caching
  handleGetHolidayById // Controller to fetch a single holiday
);

// Route to fetch all holidays
router.get(
  '/',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(holidaysCacheKey), // Middleware to handle caching
  handleGetHolidays // Controller to fetch all holidays
);

// Route to delete a holiday by ID
router.delete(
  '/holiday/:holidayId',
  handleDeleteHolidayById // Controller to handle deletion by ID
);

// Route to delete all holidays
router.delete(
  '/',
  handleDeleteAllHolidays // Controller to handle deletion of all holidays
);

// Export the configured router to be used in the main application
export default router;
