const logger = require('../utils/logger');

const logRequest = (req, res, next) => {
  logger.info(`API Request ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logRequest;