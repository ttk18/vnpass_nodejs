const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { websocketServer } = require('./middlewares/websocket');

let server;

logger.info(`Environment ${config.env}`);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info(`Connected to MongoDB ${config.mongoose.url}`);
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  global.wsServer = websocketServer(server, logger);
  global.wsServer.setup();
  logger.info('Setup websocket');
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
