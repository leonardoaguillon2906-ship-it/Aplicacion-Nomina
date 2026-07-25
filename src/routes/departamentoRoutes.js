const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
// Si tu conexión está en la carpeta config:
const pool = require('../config/database'); // Ajusta según el nombre real de tu archivo de conexión

// Ruta para ver los departamentos
router.get('/departamentos', departmentController.getAllDepartments);

module.exports = router;