// src/routes/index.js

// Importing the Router function from the Express library to create a root router for all application routes
import { Router } from 'express';

// Creating an instance of the Router to define the main application routes
const routes = Router();

// Importing the routes modules, which contains route handlers for the given-related functionality
import paymentRoutes from './payment/index.js';
import userRegistrationRoutes from './userRegistration/index.js';
import courseRoutes from './course/index.js';
import authRoutes from './auth/index.js';

// Mounting the payment routes under the `/api/v1` prefix
// All routes defined in `paymentRoutes` will now be accessible under `/api/v1`
routes.use('/payment', paymentRoutes);

// Mounting the user registration routes under the `/api/v1` prefix
// All routes defined in `user registration` will now be accessible under `/api/v1`
routes.use('/user-registration', userRegistrationRoutes);

// Mounting the course related routes under the `/api/v1` prefix
// All routes defined in `course` will now be accessible under `/api/v1`
routes.use('/courses', courseRoutes);

// Mounting the auth related routes under the `/api/v1` prefix
// All routes defined in `auth` will now be accessible under `/api/v1`
routes.use('/auth', authRoutes);

// Exporting the configured root router to be used in the main server setup
export default routes; // To be exported to server
