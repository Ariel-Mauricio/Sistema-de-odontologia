<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTreatmentPlanRequest;
use App\Models\TreatmentPlan;
use App\Models\TreatmentItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TreatmentPlanController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = TreatmentPlan::with(['patient', 'doctor', 'treatmentItems'])
            ->paginate(15);
        return response()->json($plans);
    }

    public function show(TreatmentPlan $treatmentPlan): JsonResponse
    {
        $treatmentPlan->load(['patient', 'doctor', 'treatmentItems']);
        return response()->json($treatmentPlan);
    }

    public function store(StoreTreatmentPlanRequest $request): JsonResponse
    {
        $plan = TreatmentPlan::create(array_merge(
            $request->validated(),
            [
                'doctor_id' => auth()->id(),
                'clinic_id' => auth()->user()->clinic_id ?? 1
            ]
        ));

        return response()->json($plan, 201);
    }

    public function update(Request $request, TreatmentPlan $treatmentPlan): JsonResponse
    {
        $treatmentPlan->update($request->validated());
        return response()->json($treatmentPlan);
    }

    public function addTreatmentItem(Request $request, TreatmentPlan $treatmentPlan): JsonResponse
    {
        $item = TreatmentItem::create(array_merge(
            $request->validate([
                'treatment_name' => 'required|string',
                'description' => 'nullable|string',
                'tooth_number' => 'nullable|integer',
                'tooth_status' => 'nullable|string',
                'cost' => 'required|numeric',
                'planned_date' => 'nullable|date',
            ]),
            ['treatment_plan_id' => $treatmentPlan->id]
        ));

        return response()->json($item, 201);
    }

    public function getByPatient($patientId): JsonResponse
    {
        $plans = TreatmentPlan::where('patient_id', $patientId)
            ->with('treatmentItems')
            ->get();
        return response()->json($plans);
    }
}
