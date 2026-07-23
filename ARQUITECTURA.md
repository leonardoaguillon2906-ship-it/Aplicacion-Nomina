# Arquitectura de la Aplicacion de Nomina

## Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTE (Frontend)                          │
│                   (React, Angular, Vue, etc)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API REST (Express)                          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               ROUTES (Definicion de endpoints)            │  │
│  └───────────────────┬─────────────────────────────────────┬─┘  │
│                     │                                       │    │
│  ┌──────────────────▼──────┐        ┌──────────────────────▼──┐ │
│  │      MIDDLEWARE          │        │   MIDDLEWARE ERROR    │  │
│  │ - Authentication         │        │   - Validacion        │  │
│  │ - Validation             │        │   - Manejo Errores    │  │
│  │ - Logging                │        │                       │  │
│  └──────────────────┬───────┘        └──────────────────────┬──┘ │
│                     │                                       │    │
│  ┌──────────────────▼───────────────────────────────────────▼──┐ │
│  │              CONTROLLERS (Manejo HTTP)                     │  │
│  │ - employeeController.js                                   │  │
│  │ - payrollController.js                                    │  │
│  │ - reportController.js                                     │  │
│  └──────────────────┬──────────────────────────────────────┬──┘  │
│                     │                                       │    │
│  ┌──────────────────▼──────┐        ┌──────────────────────▼──┐ │
│  │      SERVICES            │        │   SERVICES II         │  │
│  │ - PayrollService         │        │   - EmailService      │  │
│  │ - CalculationService     │        │   - PDFService        │  │
│  │ - EmployeeService        │        │   - ReportService     │  │
│  └──────────────────┬───────┘        └──────────────────────┬──┘ │
│                     │                                       │    │
│  ┌──────────────────▼───────────────────────────────────────▼──┐ │
│  │             MODELS (Acceso a Datos)                        │  │
│  │ - Employee.js                                             │  │
│  │ - Payroll.js                                              │  │
│  │ - Deduction.js                                            │  │
│  └──────────────────┬──────────────────────────────────────┬──┘  │
│                     │                                       │    │
│  ┌──────────────────▼───────────────────────────────────────▼──┐ │
│  │            UTILS & HELPERS                                 │  │
│  │ - logger.js           - dateHelper.js                     │  │
│  │ - validators.js       - formatters.js                     │  │
│  └──────────────────┬──────────────────────────────────────┬──┘  │
└─────────────────────┼──────────────────────────────────────┼────┘
                      │                                       │
┌─────────────────────▼──────────────────────────────────────▼──────┐
│                   POSTGRESQL DATABASE                             │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  employees   │  │  payroll     │  │  deductions  │            │
│  │  - id        │  │  - id        │  │  - id        │            │
│  │  - nombre    │  │  - emp_id    │  │  - emp_id    │            │
│  │  - email     │  │  - salario   │  │  - tipo      │            │
│  │  - rfc       │  │  - neto      │  │  - valor     │            │
│  │  - salario   │  │  - fecha_pago│  │  - activo    │            │
│  │  - activo    │  │  - estado    │  │              │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                    │
│  ┌──────────────┐                                                │
│  │  audit_log   │                                                │
│  │  - id        │                                                │
│  │  - tabla     │                                                │
│  │  - operacion │                                                │
│  │  - datos     │                                                │
│  └──────────────┘                                                │
└────────────────────────────────────────────────────────────────────┘
```

## Flujo de Request

```
CLIENT REQUEST
    │
    ↓
┌─────────────────────────────────────────┐
│   Express Router                        │
│   Busca ruta coincidente                │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│   Middlewares Globales                  │
│   - CORS                                │
│   - Body Parser                         │
│   - Logger                              │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│   Middlewares Especificos (si aplica)   │
│   - Authentication                      │
│   - Authorization                       │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│   Controller                            │
│   - Valida datos                        │
│   - Llama a Services                    │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│   Service Layer                         │
│   - Logica de negocio                   │
│   - Llama a Models                      │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│   Model / Database                      │
│   - Query a BD                          │
│   - Retorna datos                       │
└────────────┬────────────────────────────┘
             │
             ↓ (Response)
┌─────────────────────────────────────────┐
│   Service → Controller                  │
│   Procesa resultado                     │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│   HTTP Response                         │
│   - Status Code                         │
│   - JSON Data                           │
└─────────────────────────────────────────┘
    │
    ↓
CLIENT RECEIVES RESPONSE
```

## Flujo de Calculo de Nomina

```
GENERAR NOMINA
    │
    ├─ Validar empleado existe
    │
    ├─ Calcular periodo
    │  ├─ Dias trabajados
    │  └─ Salario prorrateado (si aplica)
    │
    ├─ Calcular deduccciones
    │  ├─ Impuesto ISR
    │  ├─ Aportacion IMSS
    │  └─ Otras deducciones
    │
    ├─ Calcular neto
    │  └─ Bruto - Deducciones
    │
    ├─ Guardar en BD
    │  └─ payroll record
    │
    ├─ Generar PDF
    │  └─ Recibo de nomina
    │
    ├─ Enviar email
    │  └─ Adjuntar PDF
    │
    └─ Registrar en audit log
       └─ Para trazabilidad
```

## Flujo de Autenticacion

```
USUARIO INTENTA ACCESO
    │
    ├─ Proporciona credenciales
    │  ├─ Email/Usuario
    │  └─ Contraseña
    │
    ├─ Verificar en BD
    │  ├─ Existe usuario?
    │  └─ Contraseña correcta?
    │
    ├─ Si valido
    │  ├─ Generar JWT
    │  ├─ Enviar al cliente
    │  └─ Cliente guarda en localStorage
    │
    ├─ Cliente en proximas peticiones
    │  └─ Incluye JWT en header Authorization
    │
    └─ Middleware valida JWT
       ├─ Extrae usuario
       ├─ Verifica permisos
       └─ Permite/Rechaza acceso
```

## Relaciones entre Tablas

```
employees
    │
    ├─────────┐
    │         │
    ↓         ↓
payroll   deductions
    │
    │
    ↓
audit_log (registra cambios en todas)
```

## Ejemplo: Crear Empleado

```
1. POST /api/employees
   Body: { nombre, apellido, email, rfc, salario... }

2. Router → employeeController.create()

3. Controller:
   - Valida datos
   - Llama Employee.create()

4. Model (Employee.create):
   - Inserta en BD
   - Retorna registro creado

5. Service (si aplica):
   - Envia notificacion
   - Registra en audit

6. Response:
   { success: true, data: { id, nombre, email... } }
```

## Ejemplo: Generar Nomina

```
1. POST /api/payroll
   Body: { employee_id, mes, ano }

2. Router → payrollController.generate()

3. Controller:
   - Valida datos
   - Llama PayrollService

4. PayrollService.generate():
   - Obtiene empleado
   - Calcula salario
   - Calcula deducciones
   - Llama CalculationService

5. CalculationService:
   - Suma bruto
   - Calcula ISR, IMSS
   - Calcula neto

6. PayrollService continua:
   - Guarda en BD
   - Genera PDF
   - Envia email

7. Response:
   { success: true, data: { payroll_id, neto... }, pdf_url }
```

## Flujo de Error

```
ERROR EN CONTROLLER/SERVICE
    │
    ├─ Lanza excepcion
    │  └─ throw new AppError()
    │
    ├─ Express lo captura
    │  └─ next(error)
    │
    ├─ Middleware de error
    │  ├─ Log del error
    │  ├─ Determina status code
    │  └─ Arma respuesta
    │
    └─ Response al cliente
       { success: false, error: "mensaje", status: 400 }
```

## Configuracion y Variables

```
.env (Development)
├─ NODE_ENV=development
├─ PORT=3000
├─ LOG_LEVEL=debug
├─ DB_HOST=localhost
└─ DB_NAME=nomina_dev

.env.production
├─ NODE_ENV=production
├─ PORT=80
├─ LOG_LEVEL=info
├─ DB_HOST=prod.db.server
└─ DB_NAME=nomina_prod
```

## Seguridad de Capas

```
Nivel 1: HTTPS/TLS
  └─ Encriptacion en transito

Nivel 2: Autenticacion (JWT)
  └─ Validar identidad

Nivel 3: Autorizacion (Roles)
  └─ admin, rh, employee, viewer

Nivel 4: Validacion de Datos
  └─ Tipos, rangos, formatos

Nivel 5: SQL Injection Prevention
  └─ Prepared statements

Nivel 6: Logging & Auditoria
  └─ Registra acciones criticas
```
