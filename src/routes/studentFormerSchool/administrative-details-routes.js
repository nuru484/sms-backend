// src/routes/studentFormerSchool/administrative-details-routes.js

import { Router } from 'express';
const router = Router();

import {
  createAdministrativeDetails,
  updateAdministrativeDetails,
} from '../../controllers/studentFormerSchool/index.js';

router.post('/:formerSchoolId/student/:studentId', createAdministrativeDetails); // Create route

router.put(
  '/:administrativeDetailsId/student/:studentId',
  updateAdministrativeDetails
); // Update route

export default router;
