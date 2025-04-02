const redis = require('redis');

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || 6379;

// const client = redis.createClient({
//   host: redisHost,
//   port: redisPort,
// });
const client = redis.createClient({
  url: `${redisHost}://${redisHost}:${redisPort}`,
});

module.exports = client;
