// src/config/redis.js
import { createClient } from 'redis';
const client = createClient();
import logger from '../utils/logger.js';

client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();

// Middleware for caching
const cacheMiddleware = (keyGenerator) => async (req, res, next) => {
  try {
    const cacheKey = keyGenerator(req);
    const data = await client.get(cacheKey);
    if (data) {
      logger.info('Cache hit');

      client.expire(cacheKey, 3600); // Extend TTL on access

      return res.status(200).json({
        message: `${cacheKey} successfully fetched from redis`,
        data: JSON.parse(data),
      });
    }

    logger.info('Cache miss');
    next();
  } catch (err) {
    logger.error('Error accessing Redis:', err);
    next();
  }
};

// Function to save data to Redis
const saveToCache = (key, value, ttl = 3600) => {
  client.setEx(key, ttl, JSON.stringify(value));
};

export { cacheMiddleware, saveToCache, client };
