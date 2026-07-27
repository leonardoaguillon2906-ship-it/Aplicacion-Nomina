const express = require('express');
const router = express.Router();
const payrollViewController = require('../controllers/payrollViewController');
const { verificarSesion } = require('../middleware/authMiddleware');

// Ruta protegida para ver la nómina simple
router.get('/nomina', verificarSesion, payrollViewController.getPayrollView);

module.exports = router;