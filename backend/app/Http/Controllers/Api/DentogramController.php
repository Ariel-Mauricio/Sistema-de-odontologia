<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dentogram;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DentogramController extends Controller
{
    public function show($patientId): JsonResponse
    {
        $dentogram = Dentogram::where('patient_id', $patientId)->first();

        if (!$dentogram) {
            $dentogram = Dentogram::create([
                'patient_id' => $patientId,
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'teeth_data' => Dentogram::initializeTeeth()
            ]);
        }

        return response()->json($dentogram);
    }

    public function update($patientId, Request $request): JsonResponse
    {
        $dentogram = Dentogram::where('patient_id', $patientId)->first();

        if (!$dentogram) {
            $dentogram = Dentogram::create([
                'patient_id' => $patientId,
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'teeth_data' => $request->input('teeth_data', Dentogram::initializeTeeth())
            ]);
        } else {
            $dentogram->update(['teeth_data' => $request->input('teeth_data')]);
        }

        return response()->json($dentogram);
    }

    public function updateTooth($patientId, $toothNumber, Request $request): JsonResponse
    {
        $dentogram = Dentogram::where('patient_id', $patientId)->first();

        if (!$dentogram) {
            $dentogram = Dentogram::create([
                'patient_id' => $patientId,
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'teeth_data' => Dentogram::initializeTeeth()
            ]);
        }

        $teeth = $dentogram->teeth_data;
        $teeth[$toothNumber] = $request->all();
        $dentogram->update(['teeth_data' => $teeth]);

        return response()->json($dentogram);
    }
}
