<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function index(): JsonResponse
    {
        $payments = Payment::with(['invoice', 'patient', 'clinic'])
            ->orderBy('payment_date', 'desc')
            ->paginate(20);
        return response()->json($payments);
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load(['invoice', 'patient', 'clinic']);
        return response()->json($payment);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $invoice = Invoice::find($request->input('invoice_id'));
        
        $payment = Payment::create(array_merge(
            $request->validated(),
            [
                'patient_id' => $invoice->patient_id,
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'receipt_number' => 'RCP-' . date('Ymd') . '-' . uniqid()
            ]
        ));

        $newPaidAmount = $invoice->paid_amount + $request->input('amount');
        $status = $newPaidAmount >= $invoice->total ? 'paid' : 'partial';
        
        $invoice->update([
            'paid_amount' => $newPaidAmount,
            'status' => $status
        ]);

        return response()->json($payment, 201);
    }

    public function getByInvoice($invoiceId): JsonResponse
    {
        $payments = Payment::where('invoice_id', $invoiceId)->get();
        return response()->json($payments);
    }
}
