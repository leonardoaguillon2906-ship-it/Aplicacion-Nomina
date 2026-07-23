// src/middleware/errorHandler.js
const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Error interno del servidor';

  logger.error('Error caught', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    requestId: req.id
  });

  // Errores de validacion
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validacion',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Errores JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalido'
    });
  }

  // Errores de base de datos
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe'
    });
  }

  // Errores operacionales
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Error desconocido
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
};

module.exports = errorHandler;
module.exports.AppError = AppError;
