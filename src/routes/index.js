// src/routes/index.js
import { Router } from 'express';
const routes = Router();

// Importing the routes modules, which contains route handlers for the given-related functionality
import paymentRouter from './payment/index.js';
import userRegistrationRouter from './userRegistration/index.js';
import courseRouter from './course/index.js';
import authRouter from './auth/index.js';
import levelRouter from './level/index.js';
import studentFormerSchoolRouter from './studentFormerSchool/index.js';
import admissionsRouter from './admissions/index.js';
import classRouter from './class/index.js';
import addressRouter from './address/index.js';
import healthAndSafetyRouter from './healthAndSafety/index.js';
import attendanceRouter from './attendance/index.js';
import usersRouter from './users/index.js';
import academicCalendarRouter from './academicCalendar/index.js';
import termRouter from './term/index.js';
import holidayRouter from './holiday/index.js';
import eventRouter from './event/index.js';

// Mounting the all the routes under the `/api/v1` prefix
routes.use('/payment', paymentRouter); // Payments
routes.use('/user-registration', userRegistrationRouter); // user registration
routes.use('/courses', courseRouter); // courses
routes.use('/auth', authRouter); // authentication
routes.use('/levels', levelRouter); // Level
routes.use('/former-school', studentFormerSchoolRouter); // Student former school
routes.use('/admissions', admissionsRouter); // Level
routes.use('/classes', classRouter); // Level
routes.use('/address', addressRouter);
routes.use('/health-safety', healthAndSafetyRouter);
routes.use('/attendance', attendanceRouter);
routes.use('/users', usersRouter);
routes.use('/academic-calendars', academicCalendarRouter);
routes.use('/terms', termRouter);
routes.use('/holidays', holidayRouter);
routes.use('/events', eventRouter);

// Exporting the configured root router to be used in the main server setup
export default routes; // To be exported to server
