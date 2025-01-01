// src/routes/academicCalendar/academic-calendar-routes.js
import { Router } from 'express';
const router = Router();

import {
  handleCreateAcademicCalendar,
  handleUpdateAcademicCalendar,
  handleGetAcademicCalendarById,
  handleGetAcademicCalendars,
  handleDeleteAcademicCalendarById,
  handleDeleteAllAcademicCalendars,
} from '../../controllers/academicCalendar/index.js';

// import {
//   validateAcademicCalendarDetails,
//   validateAcademicCalendarUpdateDetails,
// } from '../../validators/validationMiddleware/academic-calendar/academic-calendar-validation-middleware.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const academicCalendarCacheKey = (req) =>
  `academicCalendar:${req.params.calendarId}`;
const academicCalendarsCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `academicCalendars:${JSON.stringify(normalizedQuery)}`;
};

// Route to create an academic calendar
router.post(
  '/academic-calendar',
  //   validateAcademicCalendarDetails, // Middleware to validate academic calendar details
  handleCreateAcademicCalendar // Controller to handle creation logic
);

// Route to update an academic calendar by ID
router.put(
  '/academic-calendar/:calendarId',
  //   validateAcademicCalendarUpdateDetails, // Middleware to validate update details
  handleUpdateAcademicCalendar // Controller to handle update logic
);

// Route to fetch a single academic calendar by ID
router.get(
  '/academic-calendar/:calendarId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(academicCalendarCacheKey), // Middleware to handle caching
  handleGetAcademicCalendarById // Controller to fetch a single calendar
);

// Route to fetch all academic calendars
router.get(
  '/',
  cacheMiddleware(academicCalendarsCacheKey), // Middleware to handle caching
  handleGetAcademicCalendars // Controller to fetch all calendars
);

// Route to delete an academic calendar by ID
router.delete(
  '/academic-calendar/:calendarId',
  handleDeleteAcademicCalendarById // Controller to handle deletion by ID
);

// Route to delete all academic calendars
router.delete(
  '/',
  handleDeleteAllAcademicCalendars // Controller to handle deletion of all calendars
);

// Export the configured router to be used in the main application
export default router;
