// src/routes/index.js

// Importing the Router function from the Express library to create a root router for all application routes
import { Router } from 'express';

// Creating an instance of the Router to define the main application routes
const routes = Router();

// Importing the routes modules, which contains route handlers for the given-related functionality
import paymentRouter from './payment/index.js';
import userRegistrationRouter from './userRegistration/index.js';
import courseRouter from './course/index.js';
import authRouter from './auth/index.js';
import levelRouter from './level/index.js';

// Mounting the all the routes under the `/api/v1` prefix

routes.use('/payment', paymentRouter); // Payments

routes.use('/user-registration', userRegistrationRouter); // user registration

routes.use('/courses', courseRouter); // courses

routes.use('/auth', authRouter); // authentication

routes.use('/levels', levelRouter); // Level

// Exporting the configured root router to be used in the main server setup
export default routes; // To be exported to server
