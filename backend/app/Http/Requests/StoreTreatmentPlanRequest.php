<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTreatmentPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'doctor' || auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'start_date' => 'required|date|today_or_after',
            'estimated_end_date' => 'nullable|date|after:start_date',
            'total_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
