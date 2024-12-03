// Importing the Router function from the Express library to create a root router for all application routes
import { Router } from 'express';

// Creating an instance of the Router to define the main application routes
const routes = Router();

// Importing the payment routes module, which contains route handlers for payment-related functionality
import paymentRoutes from './payment/index.js';
import userRegistrationRoutes from './userRegistration/index.js';

// Mounting the payment routes under the `/api/v1` prefix
// All routes defined in `paymentRoutes` will now be accessible under `/api/v1`
routes.use('/payment', paymentRoutes);
routes.use('/user-registration', userRegistrationRoutes);

// Exporting the configured root router to be used in the main server setup
export default routes; // To be exported to server
