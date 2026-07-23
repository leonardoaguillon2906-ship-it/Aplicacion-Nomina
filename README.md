# Aplicacion de Nomina

Sistema completo de gestion de nomina con arquitectura modular y buenas practicas de programacion.

## Requisitons previos

- Node.js >= 16.0.0
- npm >= 8.0.0
- PostgreSQL >= 12

## Instalacion

1. Clonar repositorio
```bash
git clone <repositorio>
cd Aplicacion-Nomina
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus valores
```

4. Crear base de datos
```bash
createdb aplicacion_nomina
psql aplicacion_nomina < src/database/migrations/001_create_schema.sql
```

5. Iniciar servidor
```bash
npm run dev
```

El servidor estara disponible en `http://localhost:3000`

## Estructura del proyecto

```
src/
  ├── config/       - Configuracion (BD, variables)
  ├── models/       - Modelos de datos
  ├── controllers/  - Controladores (logica HTTP)
  ├── services/     - Servicios (logica de negocio)
  ├── routes/       - Definicion de rutas
  ├── middleware/   - Middlewares personalizados
  ├── utils/        - Utilidades (logger, validadores)
  └── database/     - Migraciones y seeds

tests/             - Pruebas unitarias e integracion
docs/              - Documentacion
```

## Scripts disponibles

```bash
npm start          # Iniciar servidor en produccion
npm run dev        # Iniciar con nodemon
npm test           # Ejecutar pruebas
npm run test:watch # Pruebas en modo watch
npm run lint       # Analizar codigo
npm run lint:fix   # Corregir problemas de linting
npm run format     # Formatear codigo
```

## API Endpoints

### Empleados
- `POST /api/employees` - Crear empleado
- `GET /api/employees` - Listar empleados
- `GET /api/employees/:id` - Obtener empleado
- `PATCH /api/employees/:id` - Actualizar empleado
- `DELETE /api/employees/:id` - Desactivar empleado

### Nomina
- `POST /api/payroll` - Generar nomina
- `GET /api/payroll` - Listar nominas
- `GET /api/payroll/:id` - Obtener nomina

### Reportes
- `GET /api/reports/nomina` - Reporte de nomina
- `GET /api/reports/empleados` - Reporte de empleados

## Buenas practicas implementadas

- Separacion de responsabilidades (modelos, servicios, controladores)
- Manejo centralizado de errores
- Logging estructurado
- Validacion de datos
- Autenticacion y autorizacion
- CORS y seguridad (Helmet)
- Variables de entorno
- Soft deletes
- Migraciones de BD
- Codigo comentado y organizado
- Linting y formatting automatico

## Testing

```bash
# Pruebas unitarias
npm test -- unit

# Pruebas de integracion
npm test -- integration

# Con cobertura
npm test -- --coverage
```

## Deployment

### Docker

```bash
docker-compose up -d
```

### Heroku

```bash
heroku create
git push heroku main
```

## Troubleshooting

### Error de conexion a BD
- Verificar que PostgreSQL esta ejecutandose
- Revisar credenciales en .env
- Verificar que la BD existe

### Puerto en uso
```bash
# Cambiar puerto en .env
PORT=3001
```

### Errores de dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contacto

Para problemas o sugerencias, abrir un issue en el repositorio.

## Licencia

MIT
