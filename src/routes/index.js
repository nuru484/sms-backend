// Importing the Router function from the Express library to create a root router for all application routes
import { Router } from 'express';

// Importing the payment routes module, which contains route handlers for payment-related functionality
import paymentRoutes from './paymentRoutes.js';

// Creating an instance of the Router to define the main application routes
const routes = Router();

// Mounting the payment routes under the `/api/v1` prefix
// All routes defined in `paymentRoutes` will now be accessible under `/api/v1`
routes.use('/api/v1', paymentRoutes);

// Exporting the configured root router to be used in the main server setup
export default routes;
