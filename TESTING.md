# Sistema de Gestión Odontológica - Testing

## Unit Tests Backend

```bash
cd backend
php artisan test
php artisan test --filter=PatientTest
php artisan test --coverage
```

## E2E Tests Frontend

```bash
cd frontend
ng test
ng e2e
```

## Test Coverage

- Controllers: API endpoints
- Models: Database relationships
- Services: Business logic
- Validations: Form validations
- Authentication: JWT/Sanctum

## Pruebas Manuales

### 1. Registro y Login
- Registrar nuevo usuario como paciente
- Verificar email y contraseña requeridos
- Login con credenciales correctas
- Intentar login con credenciales incorrectas

### 2. Gestión de Pacientes
- Crear nuevo paciente
- Editar información del paciente
- Buscar paciente por nombre/cédula
- Eliminar paciente

### 3. Sistema de Citas
- Agendar cita en horario disponible
- Intentar agendar en horario ocupado
- Reprogramar cita existente
- Cancelar cita

### 4. Facturación
- Generar factura
- Registrar pago completo
- Registrar pago parcial
- Verificar saldo pendiente

### 5. Inventario
- Agregar nuevo artículo
- Registrar entrada de mercancía
- Registrar salida de mercancía
- Verificar alertas de stock bajo

## Performance Testing

- Carga de 1000+ pacientes
- Listado de citas con 5000+ registros
- Generación de reportes grandes
- Uploads de documentos

## Security Testing

- SQL Injection attempts
- XSS attempts
- CSRF protection
- Rate limiting
- Role-based access control
- Data encryption
