// src/routes/payrollRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Rutas de nómina activas' });
});

module.exports = router;