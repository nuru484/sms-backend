// src/routes/extraCurricularActivities

import { Router } from 'express';
const router = Router();

import {
  createExtracurricularActivity,
  updateExtracurricularActivity,
  getExtracurricularActivity,
  deleteExtracurricularActivity,
  getStudentExtracurricularActivities,
} from '../../controllers/extraCurricularActivity/index.js';

import authorizeRole from '../../utils/middleware/authorizeRole.js';

import {
  validateExtracurricularActivityDetails,
  validateExtracurricularActivityUpdate,
} from '../../validators/validationMiddleware/extra-curricular-activity-validation-middleware.js';

// Route to create an extracurricular activity for a student
router.post(
  '/:studentId',
  validateExtracurricularActivityDetails,
  createExtracurricularActivity
);

// Route to update an extracurricular activity by ID
router.put(
  '/:extracurricularActivityId',
  validateExtracurricularActivityUpdate,
  updateExtracurricularActivity
);

// Route to get an extracurricular activity by ID
router.get('/:extracurricularActivityId', getExtracurricularActivity);

// Route to delete an extracurricular activity by ID
router.delete('/:extracurricularActivityId', deleteExtracurricularActivity);

// Route to get all extracurricular activities of a student
router.get(
  '/student/:studentId',
  authorizeRole(['STUDENT', 'ADMIN', 'TEACHER', 'STAFF']),
  getStudentExtracurricularActivities
);

// Export the configured router to be used in the main application
export default router;
