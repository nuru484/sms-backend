// src/routes/studentFormerSchool/administrative-details-routes.js

import { Router } from 'express';
const router = Router();

import {
  createAdministrativeDetails,
  updateAdministrativeDetails,
} from '../../controllers/studentFormerSchool/index.js';

router.post('/create/:formerSchoolId/:studentId', createAdministrativeDetails); // Create route

router.put(
  '/update/:administrativeDetailsId/:studentId',
  updateAdministrativeDetails
); // Update route

export default router;
