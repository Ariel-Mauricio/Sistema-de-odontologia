<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(): JsonResponse
    {
        $invoices = Invoice::with(['patient', 'clinic', 'payments'])
            ->orderBy('invoice_date', 'desc')
            ->paginate(20);
        return response()->json($invoices);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        $invoice->load(['patient', 'clinic', 'payments']);
        return response()->json($invoice);
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $total = ($request->input('subtotal') + ($request->input('tax', 0)));
        
        $invoice = Invoice::create(array_merge(
            $request->validated(),
            [
                'total' => $total,
                'invoice_number' => 'INV-' . date('Ymd') . '-' . uniqid(),
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'invoice_date' => today()
            ]
        ));

        return response()->json($invoice, 201);
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $invoice->update($request->validated());
        return response()->json($invoice);
    }

    public function getByPatient($patientId): JsonResponse
    {
        $invoices = Invoice::where('patient_id', $patientId)
            ->with('payments')
            ->orderBy('invoice_date', 'desc')
            ->get();
        return response()->json($invoices);
    }

    public function generatePDF(Invoice $invoice)
    {
        $invoice->load(['patient', 'clinic', 'payments']);
        return response()->json(['pdf' => 'PDF generation requires DOMPDF package']);
    }
}
