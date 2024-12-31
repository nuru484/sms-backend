// src/routes/users/general-user-routes.js
import { Router } from 'express';
const router = Router();

import {
  forgetPassword,
  resetPassword,
  handleGetAllUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleDeleteAllUsers,
} from '../../controllers/users/index.js';
import { cacheMiddleware } from '../../config/redis.js';
import normalizeQuery from '../../utils/helpers/normalize-query.js';
import authorizeRole from '../../utils/middleware/authorizeRole.js';

// Cache key generator
const userCacheKey = (req) => `user:${req.params.userId}`;
const usersCacheKey = (req) => {
  const normalizedQuery = normalizeQuery(req.query);
  return `users:${JSON.stringify(normalizedQuery)}`;
};

router.post('/forget-password', forgetPassword);

router.post('/reset-password', resetPassword);

router.get(
  '/',
  authorizeRole(['ADMIN']),
  cacheMiddleware(usersCacheKey),
  handleGetAllUsers
);

router.get(
  '/user/:userId',
  authorizeRole(['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']),
  cacheMiddleware(userCacheKey),
  handleGetUserById
);

router.delete('/user/:userId', authorizeRole(['ADMIN']), handleDeleteUserById);

router.delete('/', authorizeRole(['ADMIN']), handleDeleteAllUsers);

export default router;
