// src/services/calculationService.js
const logger = require('../utils/logger');

class CalculationService {
  // Calcular nomina completa
  static calculatePayroll(employee, deductions = []) {
    try {
      const salary = parseFloat(employee.salario);
      
      // Desglose de calculos
      const calculations = {
        salario_bruto: salary,
        ...this.calculateTaxes(salary),
        ...this.calculateDeductions(salary, deductions),
      };

      calculations.salario_neto = 
        calculations.salario_bruto - 
        calculations.impuesto_isr - 
        calculations.imss - 
        calculations.otras_deducciones;

      return this.formatCalculations(calculations);
    } catch (error) {
      logger.error('Error en calculo de nomina', { error: error.message });
      throw new Error(`Error al calcular nomina: ${error.message}`);
    }
  }

  // Calcular impuestos
  static calculateTaxes(salary) {
    const TASA_IMSS = parseFloat(process.env.TASA_IMSS || 0.0325);
    const TASA_ISR = parseFloat(process.env.TASA_ISR || 0.10);

    return {
      imss: salary * TASA_IMSS,
      impuesto_isr: salary * TASA_ISR
    };
  }

  // Calcular deducciones adicionales
  static calculateDeductions(salary, deductions = []) {
    let total = 0;
    
    deductions.forEach(deduction => {
      if (deduction.tipo === 'porcentaje') {
        total += salary * (deduction.valor / 100);
      } else if (deduction.tipo === 'fijo') {
        total += deduction.valor;
      }
    });

    return {
      otras_deducciones: total,
      detalle_deducciones: deductions
    };
  }

  // Formatear resultados
  static formatCalculations(calculations) {
    return {
      salario_bruto: this.roundAmount(calculations.salario_bruto),
      impuesto_isr: this.roundAmount(calculations.impuesto_isr),
      imss: this.roundAmount(calculations.imss),
      otras_deducciones: this.roundAmount(calculations.otras_deducciones),
      total_deducciones: this.roundAmount(
        calculations.impuesto_isr + 
        calculations.imss + 
        calculations.otras_deducciones
      ),
      salario_neto: this.roundAmount(calculations.salario_neto)
    };
  }

  // Redondear a 2 decimales
  static roundAmount(amount) {
    return Math.round(amount * 100) / 100;
  }

  // Calcular nomina por periodo
  static calculatePeriodPayroll(employee, startDate, endDate, deductions = []) {
    const days = this.calculateWorkDays(startDate, endDate);
    const dailySalary = parseFloat(employee.salario) / 30;
    const periodSalary = dailySalary * days;

    return {
      periodo: {
        fecha_inicio: startDate,
        fecha_fin: endDate,
        dias_trabajados: days
      },
      ...this.calculatePayroll({ ...employee, salario: periodSalary }, deductions)
    };
  }

  // Calcular dias trabajados
  static calculateWorkDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const oneDay = 24 * 60 * 60 * 1000;
    
    return Math.round((end - start) / oneDay);
  }

  // Validar datos de entrada
  static validateInput(employee, deductions) {
    if (!employee || !employee.salario) {
      throw new Error('Datos de empleado invalidos');
    }

    if (parseFloat(employee.salario) < 0) {
      throw new Error('El salario no puede ser negativo');
    }

    if (Array.isArray(deductions)) {
      deductions.forEach(d => {
        if (!d.tipo || !d.valor || d.valor < 0) {
          throw new Error('Deduccion invalida');
        }
      });
    }
  }
}

module.exports = CalculationService;
