const express = require('express');
const router = express.Router();
const payrollViewController = require('../controllers/payrollViewController');

router.get('/nomina', payrollViewController.getPayrollView);

module.exports = router;