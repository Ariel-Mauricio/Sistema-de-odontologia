<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MedicalHistoryController;
use App\Http\Controllers\Api\DentogramController;
use App\Http\Controllers\Api\TreatmentPlanController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\ClinicController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReportController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::apiResource('patients', PatientController::class);
    Route::get('/patients/search/{query}', [PatientController::class, 'search']);

    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/appointments/available/{doctorId}/{date}', [AppointmentController::class, 'getAvailable']);
    Route::get('/appointments/patient/{patientId}', [AppointmentController::class, 'getByPatient']);
    Route::get('/appointments/doctor/{doctorId}', [AppointmentController::class, 'getByDoctor']);

    Route::apiResource('medical-histories', MedicalHistoryController::class);
    Route::get('/medical-histories/patient/{patientId}', [MedicalHistoryController::class, 'getByPatient']);

    Route::get('/dentogram/{patientId}', [DentogramController::class, 'show']);
    Route::put('/dentogram/{patientId}', [DentogramController::class, 'update']);
    Route::put('/dentogram/{patientId}/tooth/{toothNumber}', [DentogramController::class, 'updateTooth']);

    Route::apiResource('treatment-plans', TreatmentPlanController::class);
    Route::post('/treatment-plans/{treatmentPlan}/items', [TreatmentPlanController::class, 'addTreatmentItem']);
    Route::get('/treatment-plans/patient/{patientId}', [TreatmentPlanController::class, 'getByPatient']);

    Route::apiResource('invoices', InvoiceController::class);
    Route::get('/invoices/patient/{patientId}', [InvoiceController::class, 'getByPatient']);
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'generatePDF']);

    Route::apiResource('payments', PaymentController::class);
    Route::get('/payments/invoice/{invoiceId}', [PaymentController::class, 'getByInvoice']);

    Route::apiResource('inventory', InventoryController::class);
    Route::post('/inventory/{inventoryItem}/movement', [InventoryController::class, 'addMovement']);
    Route::get('/inventory/low-stock', [InventoryController::class, 'getLowStock']);

    Route::apiResource('clinics', ClinicController::class);
    Route::post('/clinics/{clinic}/assign-doctor', [ClinicController::class, 'assignDoctor']);
    Route::delete('/clinics/{clinic}/remove-doctor', [ClinicController::class, 'removeDoctor']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/revenue/{period}', [DashboardController::class, 'getRevenueStats']);

    Route::get('/documents/patient/{patientId}', [DocumentController::class, 'getByPatient']);
    Route::post('/documents/patient/{patientId}', [DocumentController::class, 'store']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    // Gestión de Usuarios
    Route::apiResource('users', UserController::class);
    Route::post('/users/{user}/change-password', [UserController::class, 'changePassword']);
    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);
    Route::get('/users/role/doctors', [UserController::class, 'getDoctors']);

    // Reportes
    Route::get('/reports/revenue', [ReportController::class, 'revenue']);
    Route::get('/reports/appointments', [ReportController::class, 'appointments']);
    Route::get('/reports/patients', [ReportController::class, 'patients']);
    Route::get('/reports/inventory', [ReportController::class, 'inventory']);
});
