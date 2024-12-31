// src/routes/users/general-user-routes.js
import { Router } from 'express';
const router = Router();

import {
  forgetPassword,
  resetPassword,
} from '../../controllers/users/index.js';

router.post('/forget-password', forgetPassword);

router.post('/reset-password', resetPassword);

export default router;
