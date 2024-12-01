// src/routes/index.js
import { Router } from 'express';

import paymentRoutes from './paymentRoutes.js';

const routes = Router();

routes.use('/api/v1', paymentRoutes);

export default routes;
