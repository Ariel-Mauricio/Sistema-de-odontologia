# 🦷 Sistema de Odontología

Aplicación web full-stack para gestión clínica odontológica: pacientes, citas, historias clínicas, planes de tratamiento, facturación, inventario, reportes y administración de usuarios.

## ✨ Lo más destacado

- Interfaz moderna con Angular + TailwindCSS + Bootstrap
- Dashboard con métricas operativas
- Gestión integral de pacientes
- Agenda de citas con estados y filtros
- Historias clínicas y planes de tratamiento
- Facturación, pagos y control de cartera
- Inventario con alertas de stock bajo
- Reportes con visualización real en Chart.js
- Seguridad API con Laravel Sanctum

## 🧱 Arquitectura

- `backend/`: API REST en Laravel
- `frontend/`: SPA en Angular
- `nginx.conf`: configuración de servidor (opcional)

## 🛠️ Stack técnico

### Backend
- PHP 8.1+
- Laravel 11
- MySQL (compatible con XAMPP)
- Laravel Sanctum

### Frontend
- Angular 17
- TypeScript
- TailwindCSS
- Bootstrap 5
- Chart.js + ng2-charts

## 📋 Requisitos

- PHP 8.1+
- Composer
- Node.js 18+
- npm
- MySQL / MariaDB

## 🚀 Instalación rápida (Windows + XAMPP)

### 1) Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --host=127.0.0.1 --port=8000
```

### 2) Frontend

```bash
cd ../frontend
npm install --legacy-peer-deps
npm run start -- --host 127.0.0.1 --port 4200
```

## 🌐 Accesos

- Frontend: http://127.0.0.1:4200
- Backend API: http://127.0.0.1:8000/api

## 🔐 Credenciales demo

- Usuario: `admin@clinicadental.com`
- Password: `password123`

## 📊 Módulos principales

- Dashboard
- Pacientes
- Citas
- Historias Clínicas
- Planes de Tratamiento
- Facturación
- Inventario
- Reportes
- Usuarios

## 📚 Documentación del proyecto

- `INSTALACION.md`
- `QUICK_START.md`
- `TESTING.md`
- `VERIFICACION_PROYECTO.md`

## 🧪 Build de producción (frontend)

```bash
cd frontend
npm run build
```

## 📦 Producción (resumen)

```bash
# Backend
cd backend
composer install --no-dev
php artisan optimize
php artisan migrate --force

# Frontend
cd ../frontend
npm install
npm run build
```

## 🤝 Autor

Repositorio objetivo en GitHub:
- Usuario: `Ariel-Mauricio`
- Repo: `Sistema-de-odontologia`

---

Hecho con enfoque en calidad clínica, operación administrativa y experiencia visual moderna.
