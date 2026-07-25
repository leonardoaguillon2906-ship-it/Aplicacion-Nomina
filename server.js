require('dotenv').config();
const express = require('express');
const path = require('path');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configurar motor de vistas EJS y la carpeta views dentro de src
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Servir archivos estáticos desde la carpeta public en la raíz del proyecto
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz configurada para renderizar la vista principal (index) con el banner e imagen
app.get('/', (req, res) => {
  res.render('index');
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Servidor iniciado en puerto ${PORT} [${NODE_ENV}]`);
  console.log(`📊 Web: http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

module.exports = server;