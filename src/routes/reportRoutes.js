// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Rutas de reportes activas' });
});

module.exports = router;