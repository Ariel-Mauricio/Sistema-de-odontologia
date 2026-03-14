# Sistema de Gestión Odontológica - Documentación de Instalación

## Requisitos

### Backend (Laravel)
- PHP 8.1+
- MySQL 5.7+
- Composer
- Node.js 16+ (para build assets)

### Frontend (Angular)
- Node.js 18+
- npm 8+
- Angular CLI 17+

## Instalación Local con XAMPP

### 1. Configuración de Base de Datos

1. Abre XAMPP Control Panel
2. Inicia Apache y MySQL
3. Abre phpMyAdmin en `http://localhost/phpmyadmin`
4. Crea una nueva base de datos llamada `odontologia`

```sql
CREATE DATABASE odontologia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Instalación del Backend

```bash
cd /xampp/htdocs/sistema\ dental/backend

# Instalar dependencias
composer install

# Generar APP_KEY
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Seed de datos iniciales
php artisan db:seed

# Iniciar el servidor (puerto 8000)
php artisan serve
```

**Credenciales de acceso:**
- Email: admin@clinicadental.com
- Contraseña: password123

### 3. Instalación del Frontend

```bash
cd /xampp/htdocs/sistema\ dental/frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 4200)
ng serve

# O usar ng serve --proxy-config proxy.conf.json para proxy API
ng serve --proxy-config proxy.conf.json
```

## Estructura del Proyecto

```
sistema dental/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Requests/
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Policies/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   ├── config/
│   └── bootstrap/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── guards/
│   │   │   └── modules/
│   │   ├── assets/
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Módulos Implementados

1. **Gestión de Pacientes** - Registrar, editar, buscar pacientes
2. **Sistema de Citas** - Agendar, reprogramar y cancelar citas
3. **Agenda Clínica** - Calendario con vistas diaria, semanal y mensual
4. **Historia Clínica** - Registros médicos por paciente
5. **Odontograma Digital** - Visualización interactiva del estado dental
6. **Plan de Tratamiento** - Crear y dar seguimiento a tratamientos
7. **Facturación y Pagos** - Generar facturas y registrar pagos
8. **Inventario** - Control de materiales y medicamentos
9. **Gestión de Doctores** - Administrar personal médico
10. **Multi Clínica** - Soporte para múltiples sedes
11. **Documentos del Paciente** - Almacenar radiografías y documentos
12. **Dashboard** - Métricas y estadísticas
13. **Reportes** - Reportes de ingresos, tratamientos, etc.
14. **Roles y Permisos** - Control de acceso por rol
15. **Auditoría** - Registro de eventos y cambios
16. **Notificaciones** - Alertas de citas y eventos
17. **Autenticación** - Login con Laravel Sanctum
18. **Seguridad** - Bcrypt hashing y JWT tokens
19. **Exportación** - PDF y Excel
20. **Backup** - Sistema de respaldos

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de nuevo usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obtener usuario actual

### Pacientes
- `GET /api/patients` - Listar pacientes
- `POST /api/patients` - Crear paciente
- `GET /api/patients/{id}` - Obtener paciente
- `PUT /api/patients/{id}` - Actualizar paciente
- `DELETE /api/patients/{id}` - Eliminar paciente
- `GET /api/patients/search/{query}` - Buscar paciente

### Citas
- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `GET /api/appointments/{id}` - Obtener cita
- `PUT /api/appointments/{id}` - Actualizar cita
- `DELETE /api/appointments/{id}` - Cancelar cita
- `GET /api/appointments/available/{doctorId}/{date}` - Horarios disponibles
- `GET /api/appointments/patient/{patientId}` - Citas del paciente

### Facturación
- `GET /api/invoices` - Listar facturas
- `POST /api/invoices` - Crear factura
- `GET /api/invoices/{id}` - Obtener factura
- `POST /api/payments` - Registrar pago
- `GET /api/invoices/patient/{patientId}` - Facturas del paciente

### Inventario
- `GET /api/inventory` - Listar items
- `POST /api/inventory` - Crear item
- `POST /api/inventory/{id}/movement` - Registrar movimiento
- `GET /api/inventory/low-stock` - Items con stock bajo

### Dashboard
- `GET /api/dashboard` - Datos del dashboard
- `GET /api/dashboard/revenue/{period}` - Estadísticas de ingresos

## Despliegue en VPS Linux

### Requisitos del Servidor
```bash
sudo apt update
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml apache2 mysql-server nginx composer nodejs npm
```

### Configuración de Nginx

```nginx
# /etc/nginx/sites-available/clinicadental

server {
    listen 80;
    server_name clinicadental.com www.clinicadental.com;
    root /var/www/clinicadental/backend/public;
    
    # Redireccionar a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name clinicadental.com www.clinicadental.com;
    root /var/www/clinicadental/backend/public;
    
    ssl_certificate /etc/letsencrypt/live/clinicadental.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/clinicadental.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Frontend Angular
    location /app {
        alias /var/www/clinicadental/frontend/dist/odontologia;
        try_files $uri $uri/ /index.html;
    }
}
```

### Despliegue de Backend

```bash
cd /var/www/clinicadental/backend

# Instalar dependencias
composer install --no-dev

# Generar clave
php artisan key:generate

# Configurar permisos
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Migraciones en producción
php artisan migrate --force
php artisan db:seed --force

# Optimizar
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Despliegue de Frontend

```bash
cd /var/www/clinicadental/frontend

# Instalar dependencias
npm install

# Build de producción
ng build --configuration production

# Copiar archivos compilados
sudo cp -r dist/odontologia/* /var/www/clinicadental/frontend/dist/
```

### SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d clinicadental.com -d www.clinicadental.com
```

### Cron Jobs para Backups

```cron
# Backup automático diario a las 2 AM
0 2 * * * /var/www/clinicadental/backend/app/Console/Commands/BackupDatabase.php
```

## Variables de Entorno (.env)

```env
APP_NAME="Odontología Pro"
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=https://clinicadental.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=odontologia
DB_USERNAME=odonto_user
DB_PASSWORD=secure_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_FROM_ADDRESS=noreply@clinicadental.com

SANCTUM_STATEFUL_DOMAINS=clinicadental.com
SPA_URL=https://clinicadental.com/app
```

## Problemas Comunes

### 1. Error de Base de Datos
```bash
php artisan migrate:reset
php artisan migrate
php artisan db:seed
```

### 2. Permisos de Carpeta
```bash
sudo chmod -R 777 storage
sudo chmod -R 777 bootstrap/cache
```

### 3. CORS Error
Actualizar `config/cors.php` con dominio correcto:
```php
'allowed_origins' => ['https://clinicadental.com'],
```

## Testing

```bash
# Backend
cd backend
php artisan test

# Frontend
cd frontend
ng test
```

## Comandos Útiles

```bash
# Limpiar cache
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Ver logs
tail -f storage/logs/laravel.log

# Modo mantenimiento
php artisan down
php artisan up
```

## Soporte

Para soporte técnico o reportar bugs, contacte al equipo de desarrollo.

---

**Desarrollado con ❤️ por Sistema Dental Pro**
