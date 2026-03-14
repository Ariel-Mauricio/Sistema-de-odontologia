<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'doctor' || auth()->user()->role === 'receptionist' || auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'appointment_date' => 'sometimes|date|after:now',
            'duration_minutes' => 'sometimes|integer|min:15|max:180',
            'reason' => 'sometimes|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled,no_show',
            'cancellation_reason' => 'nullable|string|max:500',
        ];
    }
}
