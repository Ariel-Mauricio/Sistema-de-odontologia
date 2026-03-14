<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin' || auth()->user()->role === 'receptionist';
    }

    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'description' => 'required|string|max:1000',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
