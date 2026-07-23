// src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/authentication');
const { validateEmployee } = require('../middleware/validation');

// Rutas publicas
router.post('/login', employeeController.login);

// Rutas protegidas
router.use(authenticate);

// CRUD de empleados
router.post('/', 
  authorize('admin', 'rh'),
  validateEmployee,
  employeeController.create
);

router.get('/', employeeController.getAll);

router.get('/:id', employeeController.getById);

router.patch('/:id',
  authorize('admin', 'rh'),
  validateEmployee,
  employeeController.update
);

router.delete('/:id',
  authorize('admin'),
  employeeController.delete
);

// Rutas adicionales
router.get('/:id/payroll-history', employeeController.getPayrollHistory);

router.post('/:id/upload-document', employeeController.uploadDocument);

module.exports = router;
