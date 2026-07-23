-- src/database/migrations/001_create_employees_table.sql

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  rfc VARCHAR(13) UNIQUE NOT NULL,
  curp VARCHAR(18),
  puesto VARCHAR(100) NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  fecha_ingreso DATE NOT NULL,
  salario DECIMAL(12, 2) NOT NULL,
  tipo_contrato VARCHAR(50) DEFAULT 'Indefinido',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_rfc ON employees(rfc);
CREATE INDEX idx_employees_departamento ON employees(departamento);
CREATE INDEX idx_employees_activo ON employees(activo);

-- Tabla de deducciones
CREATE TABLE IF NOT EXISTS deductions (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  valor DECIMAL(12, 2) NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deductions_employee ON deductions(employee_id);

-- Tabla de nomina
CREATE TABLE IF NOT EXISTS payroll (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  periodo_inicio DATE NOT NULL,
  periodo_fin DATE NOT NULL,
  salario_bruto DECIMAL(12, 2) NOT NULL,
  impuesto_isr DECIMAL(12, 2) NOT NULL,
  imss DECIMAL(12, 2) NOT NULL,
  otras_deducciones DECIMAL(12, 2) DEFAULT 0,
  total_deducciones DECIMAL(12, 2) NOT NULL,
  salario_neto DECIMAL(12, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha_pago DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payroll_employee ON payroll(employee_id);
CREATE INDEX idx_payroll_periodo ON payroll(periodo_inicio, periodo_fin);
CREATE INDEX idx_payroll_estado ON payroll(estado);

-- Tabla de historial de cambios
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  tabla VARCHAR(100) NOT NULL,
  registro_id INTEGER NOT NULL,
  operacion VARCHAR(50) NOT NULL,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  usuario_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_tabla ON audit_log(tabla);
CREATE INDEX idx_audit_registro ON audit_log(registro_id);
