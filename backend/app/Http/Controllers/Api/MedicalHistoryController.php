<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMedicalHistoryRequest;
use App\Models\MedicalHistory;
use Illuminate\Http\JsonResponse;

class MedicalHistoryController extends Controller
{
    public function index(): JsonResponse
    {
        $histories = MedicalHistory::with(['patient', 'doctor', 'clinic'])
            ->orderBy('consultation_date', 'desc')
            ->paginate(20);
        return response()->json($histories);
    }

    public function show(MedicalHistory $medicalHistory): JsonResponse
    {
        $medicalHistory->load(['patient', 'doctor', 'clinic']);
        return response()->json($medicalHistory);
    }

    public function store(StoreMedicalHistoryRequest $request): JsonResponse
    {
        $history = MedicalHistory::create(array_merge(
            $request->validated(),
            [
                'doctor_id' => auth()->id(),
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'consultation_date' => now()
            ]
        ));

        return response()->json($history, 201);
    }

    public function update($id, StoreMedicalHistoryRequest $request): JsonResponse
    {
        $history = MedicalHistory::find($id);
        $history->update($request->validated());
        return response()->json($history);
    }

    public function getByPatient($patientId): JsonResponse
    {
        $histories = MedicalHistory::where('patient_id', $patientId)
            ->orderBy('consultation_date', 'desc')
            ->get();
        return response()->json($histories);
    }
}
