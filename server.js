// server.js
require('dotenv').config();
const app = require('./app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Manejo de excepciones no capturadas
process.on('uncaughtException', (error) => {
  logger.error('Excepcion no capturada', {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Manejo de promesas rechazadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada no manejada', {
    reason: String(reason),
    promise: String(promise)
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  logger.info(`Servidor iniciado en puerto ${PORT} [${NODE_ENV}]`, {
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Senial SIGTERM recibida, cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = server;
