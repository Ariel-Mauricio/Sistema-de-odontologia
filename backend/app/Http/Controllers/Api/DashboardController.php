<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\Patient;
use App\Models\TreatmentPlan;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $clinicId = auth()->user()->clinic_id ?? 1;

        $today = today();

        $todayAppointments = Appointment::where('clinic_id', $clinicId)
            ->whereDate('appointment_date', $today)
            ->count();

        $todayIncome = Invoice::where('clinic_id', $clinicId)
            ->whereDate('invoice_date', $today)
            ->sum('paid_amount');

        $newPatients = Patient::where('clinic_id', $clinicId)
            ->whereDate('created_at', $today)
            ->count();

        $pendingTreatments = TreatmentPlan::where('clinic_id', $clinicId)
            ->where('status', '!=', 'completed')
            ->count();

        $upcomingAppointments = Appointment::where('clinic_id', $clinicId)
            ->where('appointment_date', '>=', now())
            ->orderBy('appointment_date')
            ->limit(5)
            ->with('patient', 'doctor')
            ->get();

        return response()->json([
            'today_appointments' => $todayAppointments,
            'today_income' => $todayIncome,
            'new_patients' => $newPatients,
            'pending_treatments' => $pendingTreatments,
            'upcoming_appointments' => $upcomingAppointments
        ]);
    }

    public function getRevenueStats($period = 'month'): JsonResponse
    {
        $clinicId = auth()->user()->clinic_id ?? 1;

        if ($period === 'month') {
            $revenue = Invoice::where('clinic_id', $clinicId)
                ->whereMonth('invoice_date', now()->month)
                ->sum('paid_amount');
        } else {
            $revenue = Invoice::where('clinic_id', $clinicId)
                ->whereYear('invoice_date', now()->year)
                ->sum('paid_amount');
        }

        return response()->json(['revenue' => $revenue]);
    }
}
