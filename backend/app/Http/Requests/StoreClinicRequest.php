<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClinicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:clinics',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:clinics',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'ruc' => 'nullable|string|max:50|unique:clinics',
            'business_hours' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }
}
