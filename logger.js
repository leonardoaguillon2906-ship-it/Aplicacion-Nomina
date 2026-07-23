// src/utils/logger.js
const fs = require('fs');
const path = require('path');

const LOG_LEVEL = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLevel = LOG_LEVEL[process.env.LOG_LEVEL || 'INFO'];

const formatTimestamp = () => new Date().toISOString();

const logToFile = (level, message, data = {}) => {
  const logDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, 'app.log');
  const logEntry = JSON.stringify({
    timestamp: formatTimestamp(),
    level,
    message,
    ...data
  }) + '\n';

  fs.appendFileSync(logFile, logEntry);
};

const log = (level, message, data = {}) => {
  if (LOG_LEVEL[level] > currentLevel) return;

  const timestamp = formatTimestamp();
  const output = `[${timestamp}] [${level}] ${message}`;

  switch (level) {
    case 'ERROR':
      console.error(output, data);
      break;
    case 'WARN':
      console.warn(output, data);
      break;
    default:
      console.log(output, data);
  }

  if (process.env.NODE_ENV === 'production') {
    logToFile(level, message, data);
  }
};

module.exports = {
  error: (message, data) => log('ERROR', message, data),
  warn: (message, data) => log('WARN', message, data),
  info: (message, data) => log('INFO', message, data),
  debug: (message, data) => log('DEBUG', message, data)
};
