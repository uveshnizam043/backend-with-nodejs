// redis/documentCacheService.js
// const { redisClient } = require('../config/redis');
import { redisClient } from '../config/redis.js';



const cacheDocument = (docId, data, expiration = 3600) => {
    redisClient.setex(`document:${docId}`, expiration, JSON.stringify(data));
};

// Get cached document from Redis
const getCachedDocument = (docId, callback) => {
    redisClient.get(`document:${docId}`, (err, data) => {
        if (err) throw err;
        callback(data ? JSON.parse(data) : null);
    });
};

export  { cacheDocument, getCachedDocument };
