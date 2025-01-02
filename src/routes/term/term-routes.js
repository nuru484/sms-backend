import { Router } from 'express';
const router = Router();

import {
  handleCreateTerm,
  handleUpdateTerm,
  handleGetTermById,
  handleGetTerms,
  handleDeleteTermById,
  handleDeleteAllTerms,
} from '../../controllers/term/index.js';

import {
  validateTermDetails,
  validateTermUpdateDetails,
} from '../../validators/validationMiddleware/term/term-validation-middleware.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const termCacheKey = (req) => `term:${req.params.termId}`;
const termsCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `terms:${JSON.stringify(normalizedQuery)}`;
};

// Route to create a term
router.post(
  '/term',
  validateTermDetails,
  handleCreateTerm // Controller to handle creation logic
);

// Route to update a term by ID
router.put(
  '/term/:termId',
  validateTermUpdateDetails,
  handleUpdateTerm // Controller to handle update logic
);

// Route to fetch a single term by ID
router.get(
  '/term/:termId',
  authorizeRole(['ADMIN', 'STUDENT', 'TEACHER', 'STAFF', 'PARENT']), // Middleware to authorize roles
  cacheMiddleware(termCacheKey), // Middleware to handle caching
  handleGetTermById // Controller to fetch a single term
);

// Route to fetch all terms
router.get(
  '/',
  cacheMiddleware(termsCacheKey), // Middleware to handle caching
  handleGetTerms // Controller to fetch all terms
);

// Route to delete a term by ID
router.delete(
  '/term/:termId',
  handleDeleteTermById // Controller to handle deletion by ID
);

// Route to delete all terms
router.delete(
  '/',
  handleDeleteAllTerms // Controller to handle deletion of all terms
);

// Export the configured router to be used in the main application
export default router;
