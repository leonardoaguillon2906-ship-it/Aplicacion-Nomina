// tests/unit/calculationService.test.js
const CalculationService = require('../../src/services/calculationService');

describe('CalculationService', () => {
  const mockEmployee = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    salario: 10000,
    puesto: 'Desarrollador'
  };

  beforeEach(() => {
    process.env.TASA_IMSS = '0.0325';
    process.env.TASA_ISR = '0.10';
  });

  describe('calculatePayroll', () => {
    it('debe calcular la nomina correctamente', () => {
      const result = CalculationService.calculatePayroll(mockEmployee);

      expect(result.salario_bruto).toBe(10000);
      expect(result.imss).toBe(325);
      expect(result.impuesto_isr).toBe(1000);
      expect(result.total_deducciones).toBe(1325);
      expect(result.salario_neto).toBe(8675);
    });

    it('debe manejar deducciones adicionales', () => {
      const deductions = [
        { tipo: 'fijo', valor: 100 },
        { tipo: 'porcentaje', valor: 5 }
      ];

      const result = CalculationService.calculatePayroll(mockEmployee, deductions);

      expect(result.otras_deducciones).toBe(600);
      expect(result.salario_neto).toBe(8075);
    });

    it('debe redondear correctamente', () => {
      const employee = { ...mockEmployee, salario: 10001.456 };
      const result = CalculationService.calculatePayroll(employee);

      expect(result.salario_bruto).toBe(10001.46);
    });
  });

  describe('calculateTaxes', () => {
    it('debe calcular impuestos correctamente', () => {
      const taxes = CalculationService.calculateTaxes(10000);

      expect(taxes.imss).toBe(325);
      expect(taxes.impuesto_isr).toBe(1000);
    });
  });

  describe('calculateWorkDays', () => {
    it('debe calcular dias entre fechas correctamente', () => {
      const days = CalculationService.calculateWorkDays('2024-01-01', '2024-01-31');

      expect(days).toBe(30);
    });

    it('debe retornar 0 para la misma fecha', () => {
      const days = CalculationService.calculateWorkDays('2024-01-01', '2024-01-01');

      expect(days).toBe(0);
    });
  });

  describe('validateInput', () => {
    it('debe lanzar error si datos de empleado son invalidos', () => {
      expect(() => {
        CalculationService.validateInput(null, []);
      }).toThrow('Datos de empleado invalidos');
    });

    it('debe lanzar error si salario es negativo', () => {
      const employee = { ...mockEmployee, salario: -100 };

      expect(() => {
        CalculationService.validateInput(employee, []);
      }).toThrow('El salario no puede ser negativo');
    });

    it('debe lanzar error si deduccion es invalida', () => {
      const deductions = [
        { tipo: 'fijo', valor: -100 }
      ];

      expect(() => {
        CalculationService.validateInput(mockEmployee, deductions);
      }).toThrow('Deduccion invalida');
    });
  });

  describe('calculatePeriodPayroll', () => {
    it('debe calcular nomina por periodo', () => {
      const result = CalculationService.calculatePeriodPayroll(
        mockEmployee,
        '2024-01-01',
        '2024-01-31'
      );

      expect(result.periodo.dias_trabajados).toBe(30);
      expect(result.periodo.fecha_inicio).toBe('2024-01-01');
      expect(result.periodo.fecha_fin).toBe('2024-01-31');
    });
  });
});
