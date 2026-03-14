<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::with(['user', 'clinic'])->paginate(15);
        return response()->json($patients);
    }

    public function show(Patient $patient): JsonResponse
    {
        $patient->load(['user', 'clinic', 'appointments', 'medicalHistories', 'treatmentPlans']);
        return response()->json($patient);
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = Patient::create(array_merge(
            $request->validated(),
            ['clinic_id' => auth()->user()->clinic_id ?? 1]
        ));

        return response()->json($patient, 201);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $patient->update($request->validated());
        return response()->json($patient);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }

    public function search($query): JsonResponse
    {
        $patients = Patient::where('full_name', 'like', "%$query%")
            ->orWhere('document_number', 'like', "%$query%")
            ->orWhere('email', 'like', "%$query%")
            ->limit(10)
            ->get();

        return response()->json($patients);
    }
}
