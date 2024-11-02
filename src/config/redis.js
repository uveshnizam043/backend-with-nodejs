// config/redis.js
import redis from "redis";
// Redis client for caching
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

// Redis client for Pub/Sub
const pubSubClient = redis.createClient();

redisClient.on('error', (err) => console.error('Redis error:', err));
pubSubClient.on('error', (err) => console.error('Redis PubSub error:', err));

export { redisClient, pubSubClient };
