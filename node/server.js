const mongoose = require('mongoose');
const app = require('./index');
const client = require('./redisClient');
const logger = require('./logger');

client.on('connect', () => {
  logger.info('Connected to redis !');
});

client.on('error', (err) => {
  logger.info(`Failed to connect :( ${err}`);
});

const startConnection = async () => {
  await client.connect();
  const res = await client.ping();
  logger.info(res);
};

startConnection();

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('Connected to db'))
  .catch((err) => logger.error(err.message));

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
