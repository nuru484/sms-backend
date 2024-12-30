// src/routes/level/level-routes.js
import { Router } from 'express';
const router = Router();

import {
  handleLevelCreation,
  handleLevelUpdate,
  handleGetLevelById,
  handleGetLevels,
  handleDeleteLevelById,
  handleDeleteAllLevels,
} from '../../controllers/level/index.js';
import {
  validateLevelDetails,
  validateLevelUpdateDetails,
} from '../../validators/validationMiddleware/level/level-validation-middleware.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';

// Cache key generator
const levelCacheKey = (req) => `level:${req.params.levelId}`;
const levelsCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `levels:${JSON.stringify(normalizedQuery)}`;
};

router.post('/level', validateLevelDetails, handleLevelCreation);

router.put('/level/:levelId', validateLevelUpdateDetails, handleLevelUpdate);

router.get(
  '/level/:levelId',
  cacheMiddleware(levelCacheKey),
  handleGetLevelById
);

router.get('/', cacheMiddleware(levelsCacheKey), handleGetLevels);

router.delete('/level/:levelId', handleDeleteLevelById);

router.delete('/', handleDeleteAllLevels);

export default router;
