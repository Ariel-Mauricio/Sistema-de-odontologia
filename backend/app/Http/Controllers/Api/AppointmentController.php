<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    public function index(): JsonResponse
    {
        $appointments = Appointment::with(['patient', 'doctor', 'clinic'])
            ->orderBy('appointment_date')
            ->paginate(20);
        return response()->json($appointments);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load(['patient', 'doctor', 'clinic']);
        return response()->json($appointment);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $appointment = Appointment::create(array_merge(
            $request->validated(),
            ['clinic_id' => auth()->user()->clinic_id ?? 1]
        ));

        return response()->json($appointment, 201);
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $appointment->update($request->validated());
        return response()->json($appointment);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        return response()->json(['message' => 'Appointment cancelled']);
    }

    public function getAvailable($doctorId, $date): JsonResponse
    {
        $appointment = new Appointment();
        $slots = $appointment->getAvailableSlots($doctorId, auth()->user()->clinic_id ?? 1, $date);
        return response()->json(['slots' => $slots]);
    }

    public function getByPatient($patientId): JsonResponse
    {
        $appointments = Appointment::where('patient_id', $patientId)
            ->orderBy('appointment_date', 'desc')
            ->get();
        return response()->json($appointments);
    }

    public function getByDoctor($doctorId): JsonResponse
    {
        $appointments = Appointment::where('doctor_id', $doctorId)
            ->orderBy('appointment_date')
            ->paginate(20);
        return response()->json($appointments);
    }
}
