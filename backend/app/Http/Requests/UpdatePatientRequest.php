<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin' || auth()->user()->role === 'receptionist';
    }

    public function rules(): array
    {
        return [
            'full_name' => 'sometimes|string|max:255',
            'document_number' => 'sometimes|unique:patients,document_number,' . $this->route('patient'),
            'birth_date' => 'sometimes|date|before:today',
            'gender' => 'nullable|in:M,F,O',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|unique:patients,email,' . $this->route('patient'),
            'address' => 'sometimes|string',
            'city' => 'sometimes|string',
            'state' => 'sometimes|string',
            'postal_code' => 'sometimes|string',
            'allergies' => 'nullable|string',
            'diseases' => 'nullable|string',
            'medications' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'insurance_company' => 'nullable|string',
            'insurance_policy' => 'nullable|string',
        ];
    }
}
