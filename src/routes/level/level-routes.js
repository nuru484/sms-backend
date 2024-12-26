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

// Cache key generator
const levelCacheKey = (req) => `level:${req.params.id}`;
const allLevelsCacheKey = (req) => `allLevels`;

router.post('/level', validateLevelDetails, handleLevelCreation);

router.put('/level/:id', validateLevelUpdateDetails, handleLevelUpdate);

router.get('/level/:id', cacheMiddleware(levelCacheKey), handleGetLevelById);

router.get('/', cacheMiddleware(allLevelsCacheKey), handleGetLevels);

router.delete('/level/:id', handleDeleteLevelById);

router.delete('/', handleDeleteAllLevels);

export default router;
