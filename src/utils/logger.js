// utils/logger.js
const winston = require('winston');
const { format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// Define log format
const logFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

const logLevel = process.env.LOG_LEVEL || 'debug'; // Default to 'debug'

// Create transports for logging
const transports = [
  // Log to console in development
  new winston.transports.Console({
    level: logLevel,
    format: logFormat
  })
];

// If in production, log to daily rotating files
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new DailyRotateFile({
      filename: 'logs/%DATE%-application.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: logFormat
    })
  );
}

// Create the logger instance
const logger = winston.createLogger({
  level: logLevel,  // Minimum level of logging for this app
  format: winston.format.json(),
  transports: transports,
});

module.exports = logger;