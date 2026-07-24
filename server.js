require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Servidor iniciado en puerto ${PORT} [${NODE_ENV}]`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

module.exports = server;