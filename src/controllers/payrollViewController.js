const CalculationService = require('../services/calculationService');

exports.getPayrollView = (req, res, next) => {
    try {
        // Datos de ejemplo o simulados para la vista (puedes enlazarlos a tu BD más adelante)
        const employee = { nombre: 'Juan Pérez', salario: 15000 };
        const deductions = [
            { tipo: 'porcentaje', valor: 2 } // Ejemplo: 2% de caja de ahorro
        ];

        // Validar datos usando el servicio
        CalculationService.validateInput(employee, deductions);

        // Calcular la nómina completa
        const nomina = CalculationService.calculatePayroll(employee, deductions);

        // Renderizar la vista EJS pasando los resultados
        res.render('nomina', { employee, nomina });
    } catch (error) {
        next(error);
    }
};