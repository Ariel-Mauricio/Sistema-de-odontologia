<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin' || auth()->user()->role === 'receptionist';
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'document_number' => 'required|unique:patients|string',
            'document_type' => 'required|in:CC,CE,PA,PEP',
            'birth_date' => 'required|date|before:today',
            'gender' => 'nullable|in:M,F,O',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:patients',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'postal_code' => 'required|string',
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
