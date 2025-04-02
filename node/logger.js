const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:dd-mm-yyy HH:mm:ss',
      ignore: 'pid,hostname',
    },
  },
});

module.exports = logger;
