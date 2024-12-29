// src/routes/disciplinaryAction/disciplinary-action-routes.js
import { Router } from 'express';
const router = Router();

import {
  createDisciplinaryAction,
  updateDisciplinaryAction,
  getDisciplinaryAction,
  deleteDisciplinaryAction,
  getStudentDisciplinaryActions,
} from '../../controllers/disciplinaryAction/index.js';
import {
  validateDisciplinaryActionDetails,
  validateDisciplinaryActionUpdate,
} from '../../validators/validationMiddleware/disciplinary-action-validation-middleware.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator

// Cache key generator
const disciplinaryActionCacheKey = (req) =>
  `disciplinaryAction:${req.params.disciplinaryActionId}`;

const studentDisciplinaryActionsCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `disciplinaryActions:student:${req.params.studentId}${JSON.stringify(
    normalizedQuery
  )}`;
};

// Route to create a disciplinary action for a student
router.post(
  '/:studentId',
  validateDisciplinaryActionDetails,
  createDisciplinaryAction
);

// Route to update a disciplinary action by ID
router.put(
  '/:disciplinaryActionId',
  validateDisciplinaryActionUpdate,
  updateDisciplinaryAction
);

// Route to get a disciplinary action by ID
router.get(
  '/:disciplinaryActionId',
  cacheMiddleware(disciplinaryActionCacheKey),
  getDisciplinaryAction
);

// Route to delete a disciplinary action by ID
router.delete('/:disciplinaryActionId', deleteDisciplinaryAction);

// Route to get  all disciplinary action of a student
router.get(
  '/student/:studentId',
  authorizeRole(['STUDENT', 'ADMIN', 'TEACHER', 'STAFF']),
  cacheMiddleware(studentDisciplinaryActionsCacheKey),
  getStudentDisciplinaryActions
);

// Export the configured router to be used in the main application
export default router;
