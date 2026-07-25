const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const employeeRoutes = require('./routes/employeeRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const reportRoutes = require('./routes/reportRoutes');
const departamentoRoutes = require('./routes/departamentoRoutes');
const payrollViewRoutes = require('./routes/payrollViewRoutes');
const nominaAutomaticaRoutes = require('./routes/nominaAutomaticaRoutes');
const indexRoutes = require('./routes/indexRoutes');

// 1. Inicializar Express ANTES de usar cualquier 'app.use()'
const app = express();

// Configuración del motor de vistas EJS y directorio de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ¡AQUÍ ESTABA EL ERROR!: Servir archivos estáticos desde la carpeta public ubicada en la raíz del proyecto
app.use(express.static(path.join(__dirname, '../public')));

// 2. Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middlewares globales (Logger, IDs, etc.)
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID();
  logger.info(`[${req.id}] ${req.method} ${req.path}`);
  next();
});

// 3. Registrar todas las rutas (después de inicializar app)
app.use('/api', departamentoRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/reports', reportRoutes);
app.use('/', payrollViewRoutes);
app.use('/', nominaAutomaticaRoutes);
app.use('/', indexRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Middleware de manejo de errores (debe ser el ultimo)
app.use(errorHandler);

module.exports = app;