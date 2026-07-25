// src/config/database.js
const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'aplicacion_nomina',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD, 
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Error inesperado en pool de base de datos', {
    message: err.message,
    code: err.code
  });
});

pool.on('connect', () => {
  logger.debug('Nueva conexion establecida a la base de datos');
});

// Test de conexion
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    logger.error('Error al conectar a la base de datos', {
      message: err.message
    });
  } else {
    logger.info('Conexion exitosa a la base de datos', {
      timestamp: result.rows[0].now
    });
  }
});

module.exports = pool;
