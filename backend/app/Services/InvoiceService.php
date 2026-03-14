<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;

class InvoiceService
{
    public function generateInvoiceNumber(): string
    {
        $date = date('Ymd');
        $count = Invoice::whereDate('created_at', today())->count() + 1;
        return 'INV-' . $date . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function calculateTotal($subtotal, $tax = 0)
    {
        return $subtotal + $tax;
    }

    public function recordPayment(Invoice $invoice, $amount, $method, $reference = null)
    {
        $newPaidAmount = $invoice->paid_amount + $amount;
        $status = $newPaidAmount >= $invoice->total ? 'paid' : 'partial';

        $payment = Payment::create([
            'invoice_id' => $invoice->id,
            'patient_id' => $invoice->patient_id,
            'clinic_id' => $invoice->clinic_id,
            'amount' => $amount,
            'payment_method' => $method,
            'reference_number' => $reference,
            'payment_date' => today(),
            'receipt_number' => 'RCP-' . date('Ymd') . '-' . uniqid()
        ]);

        $invoice->update([
            'paid_amount' => $newPaidAmount,
            'status' => $status
        ]);

        return $payment;
    }

    public function getRemainingBalance(Invoice $invoice)
    {
        return $invoice->total - $invoice->paid_amount;
    }
}
