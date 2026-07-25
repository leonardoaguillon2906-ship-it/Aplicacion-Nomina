const express = require('express');
const router = express.Router();
const controller = require('../controllers/nominaAutomaticaController');

router.get('/nomina-automatica', controller.getNominaView);
router.post('/nomina/agregar', controller.agregarEmpleado);

module.exports = router;