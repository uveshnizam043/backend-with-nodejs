// redisConnection.js
import redis from 'redis';

const redisConfig = {
  host: '127.0.0.1',
  port: 6379,
};



// Initialize the Redis client
const redisClient = redis.createClient(redisConfig);

// Connect to Redis and handle connection events
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch(err => {
  console.error('Error connecting to Redis:', err);
});


export default redisClient;
