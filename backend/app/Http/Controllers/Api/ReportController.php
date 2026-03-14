<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function revenue(Request $request): JsonResponse
    {
        $from = $request->query('from') ? Carbon::parse($request->query('from')) : Carbon::now()->subMonth();
        $to = $request->query('to') ? Carbon::parse($request->query('to')) : Carbon::now();

        $invoices = Invoice::whereBetween('invoice_date', [$from, $to])
            ->with(['patient', 'payments'])
            ->get();

        $totalRevenue = $invoices->sum('paid_amount');
        $paidInvoices = $invoices->where('status', 'paid')->count();
        $pendingAmount = $invoices->sum(function ($invoice) {
            return $invoice->total - $invoice->paid_amount;
        });

        return response()->json([
            'invoices' => $invoices,
            'total_revenue' => $totalRevenue,
            'paid_invoices' => $paidInvoices,
            'pending_amount' => $pendingAmount,
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d')
            ]
        ]);
    }

    public function appointments(Request $request): JsonResponse
    {
        $from = $request->query('from') ? Carbon::parse($request->query('from')) : Carbon::now()->subMonth();
        $to = $request->query('to') ? Carbon::parse($request->query('to')) : Carbon::now();
        $status = $request->query('status');

        $query = Appointment::whereBetween('appointment_date', [$from, $to])
            ->with(['patient', 'doctor', 'clinic']);

        if ($status) {
            $query->where('status', $status);
        }

        $appointments = $query->get();

        return response()->json([
            'appointments' => $appointments,
            'total' => $appointments->count(),
            'completed' => $appointments->where('status', 'completed')->count(),
            'pending' => $appointments->where('status', 'pending')->count(),
            'confirmed' => $appointments->where('status', 'confirmed')->count(),
            'cancelled' => $appointments->where('status', 'cancelled')->count(),
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d')
            ]
        ]);
    }

    public function patients(Request $request): JsonResponse
    {
        $from = $request->query('from') ? Carbon::parse($request->query('from')) : Carbon::now()->subMonth();
        $to = $request->query('to') ? Carbon::parse($request->query('to')) : Carbon::now();

        // Pacientes nuevos en el período
        $newPatients = Patient::whereBetween('created_at', [$from, $to])->get();

        // Todos los pacientes
        $allPatients = Patient::all();

        // Pacientes con citas en el período
        $activePatients = Patient::has('appointments')
            ->whereHas('appointments', function ($query) use ($from, $to) {
                $query->whereBetween('appointment_date', [$from, $to]);
            })
            ->get();

        return response()->json([
            'patients' => $newPatients,
            'total_patients' => $allPatients->count(),
            'new_patients' => $newPatients->count(),
            'active_patients' => $activePatients->count(),
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d')
            ]
        ]);
    }

    public function inventory(Request $request): JsonResponse
    {
        $items = InventoryItem::all();

        $lowStockItems = $items->filter(function ($item) {
            return $item->quantity <= $item->minimum_stock;
        });

        $expiredItems = $items->filter(function ($item) {
            return $item->expiry_date && Carbon::parse($item->expiry_date)->isPast();
        });

        $totalValue = $items->sum(function ($item) {
            return $item->quantity * $item->unit_cost;
        });

        return response()->json([
            'total_items' => $items->count(),
            'low_stock_count' => $lowStockItems->count(),
            'expired_count' => $expiredItems->count(),
            'low_stock_items' => $lowStockItems->values(),
            'expired_items' => $expiredItems->values(),
            'total_value' => $totalValue,
            'items' => $items
        ]);
    }
}
