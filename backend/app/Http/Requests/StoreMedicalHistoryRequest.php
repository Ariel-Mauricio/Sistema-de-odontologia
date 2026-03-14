<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalHistoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'doctor' || auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'diagnosis' => 'required|string|max:1000',
            'observations' => 'nullable|string|max:1000',
            'evolution' => 'nullable|string|max:1000',
            'treatment_plan' => 'nullable|string|max:1000',
            'medications_prescribed' => 'nullable|string|max:500',
            'recommendations' => 'nullable|string|max:500',
            'next_visit' => 'nullable|date|after:now',
        ];
    }
}
