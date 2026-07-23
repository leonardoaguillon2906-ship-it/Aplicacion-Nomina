# Mejores Practicas - Aplicacion de Nomina

## 1. Estructura y Organizacion

### Principio de Separacion de Responsabilidades

```
Models    -> Acceso a datos
Services  -> Logica de negocio
Controllers -> Manejo HTTP
Routes    -> Definicion de endpoints
```

**Correcto:**
```javascript
// Service maneja logica de negocio
class PayrollService {
  static calculateSalary(employee) {
    // Logica compleja aqui
  }
}

// Controller llama al service
router.post('/payroll', (req, res) => {
  const result = PayrollService.calculateSalary(req.body);
  res.json(result);
});
```

**Incorrecto:**
```javascript
// No mezclar logica en rutas
router.post('/payroll', (req, res) => {
  // Todo el calculo aqui - difícil de testear
  const salary = req.body.salary * 0.9;
  res.json(salary);
});
```

## 2. Manejo de Errores

### Usar clases de error personalizadas

```javascript
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

// Uso
if (!email) {
  throw new ValidationError('Email requerido');
}
```

### Siempre usar try-catch

```javascript
static async create(data) {
  try {
    const result = await db.query(...);
    return result;
  } catch (error) {
    logger.error('Error en create', { error: error.message });
    throw new AppError('No se pudo crear', 500);
  }
}
```

## 3. Validacion de Datos

### Validar en modelos y controllers

```javascript
// Modelo
static validate(data) {
  const errors = {};
  
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Email invalido';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

// Controller
const errors = Employee.validate(req.body);
if (errors) {
  return res.status(400).json({ errors });
}
```

## 4. Seguridad

### Nunca guardar credenciales en codigo

```javascript
// Correcto
const password = process.env.DB_PASSWORD;

// Incorrecto
const password = 'mi_contraseña_123';
```

### Usar variables de entorno

```javascript
// .env
DB_PASSWORD=secure_password_here

// Uso
const password = process.env.DB_PASSWORD;
```

### Hashear contrasenas

```javascript
const bcrypt = require('bcryptjs');

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

## 5. Base de Datos

### Usar prepared statements

```javascript
// Correcto - Previene SQL injection
const query = 'SELECT * FROM users WHERE email = $1';
const result = await pool.query(query, [email]);

// Incorrecto - Vulnerable a ataques
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

### Usar transacciones para operaciones criticas

```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE employees SET salary = $1 WHERE id = $2', [salary, id]);
  await client.query('INSERT INTO audit_log ...');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## 6. Testing

### Escribir tests para logica critica

```javascript
describe('PayrollService', () => {
  it('debe calcular salario neto correctamente', () => {
    const employee = { salario: 10000 };
    const result = PayrollService.calculateSalary(employee);
    expect(result.neto).toBe(9000);
  });
});
```

### Mockear dependencias externas

```javascript
jest.mock('../models/Employee');

describe('EmployeeService', () => {
  it('debe obtener empleado', async () => {
    Employee.findById.mockResolvedValue({ id: 1, nombre: 'Juan' });
    const result = await EmployeeService.getById(1);
    expect(result.nombre).toBe('Juan');
  });
});
```

## 7. Logging

### Loguear eventos importantes

```javascript
logger.info('Nomina generada', { 
  employeeId: emp.id, 
  amount: payroll.neto 
});

logger.error('Error en calculo', { 
  error: err.message,
  stack: err.stack 
});
```

### No loguear datos sensibles

```javascript
// Correcto
logger.info('Usuario logueado', { email: 'user@example.com' });

// Incorrecto
logger.info('Usuario logueado', { password: 'mi_pass_123' });
```

## 8. Nombres y Convenciones

### Usar nombres descriptivos

```javascript
// Correcto
const calculateMonthlyPayroll = () => {};
const getEmployeeById = (id) => {};

// Incorrecto
const calc = () => {};
const get = (x) => {};
```

### Constantes en mayuscula

```javascript
const MAX_SALARY = 1000000;
const MIN_SALARY = 248.93;
const DEDUCTION_RATE = 0.10;
```

## 9. Versionado y Control

### Usar git efectivamente

```bash
# Commits claros
git commit -m "feat: agregar calculo de ISR"
git commit -m "fix: corregir error en deduccion"

# No hacer
git commit -m "arreglos varios"
git commit -m "xyz"
```

### Branching strategy

```bash
main       -> Produccion
develop    -> Desarrollo
feature/*  -> Nuevas funcionalidades
bugfix/*   -> Correcciones
```

## 10. Performance

### Usar indices en BD

```sql
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_payroll_date ON payroll(fecha_pago);
```

### Cachear datos que no cambian frecuentemente

```javascript
const cachedDepartments = new Map();

static async getDepartments() {
  if (cachedDepartments.size > 0) {
    return Array.from(cachedDepartments.values());
  }
  
  const depts = await db.query('SELECT * FROM departments');
  depts.forEach(d => cachedDepartments.set(d.id, d));
  return depts;
}
```

### Paginar resultados grandes

```javascript
static async findAll(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const query = 'SELECT * FROM employees LIMIT $1 OFFSET $2';
  return pool.query(query, [limit, offset]);
}
```

## 11. Documentacion

### Documentar funciones complejas

```javascript
/**
 * Calcula la nomina mensual de un empleado
 * @param {Object} employee - Datos del empleado
 * @param {number} employee.salario - Salario mensual
 * @param {Array} deductions - Array de deducciones
 * @returns {Object} Objeto con desglose de nomina
 */
static calculatePayroll(employee, deductions = []) {
  // Implementacion
}
```

### Mantener README actualizado

- Instrucciones de instalacion
- Como correr los tests
- Variables de entorno necesarias
- Estructura del proyecto

## 12. Deployment

### Usar variables de entorno diferentes

```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug

# .env.production
NODE_ENV=production
LOG_LEVEL=info
```

### Health checks

```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

### Graceful shutdown

```javascript
process.on('SIGTERM', () => {
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});
```
