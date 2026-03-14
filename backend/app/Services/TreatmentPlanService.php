<?php

namespace App\Services;

use App\Models\TreatmentPlan;
use App\Models\TreatmentItem;

class TreatmentPlanService
{
    public function createTreatmentPlan($patientId, $doctorId, $clinicId, $data)
    {
        $plan = TreatmentPlan::create([
            'patient_id' => $patientId,
            'doctor_id' => $doctorId,
            'clinic_id' => $clinicId,
            'name' => $data['name'],
            'description' => $data['description'],
            'start_date' => $data['start_date'],
            'estimated_end_date' => $data['estimated_end_date'] ?? null,
            'total_cost' => $data['total_cost'],
            'status' => 'pending',
            'notes' => $data['notes'] ?? null
        ]);

        return $plan;
    }

    public function addTreatment(TreatmentPlan $plan, $treatmentData)
    {
        $item = TreatmentItem::create([
            'treatment_plan_id' => $plan->id,
            'treatment_name' => $treatmentData['treatment_name'],
            'description' => $treatmentData['description'] ?? null,
            'tooth_number' => $treatmentData['tooth_number'] ?? null,
            'tooth_status' => $treatmentData['tooth_status'] ?? null,
            'cost' => $treatmentData['cost'],
            'status' => 'pending',
            'planned_date' => $treatmentData['planned_date'] ?? null
        ]);

        return $item;
    }

    public function completeTreatment(TreatmentItem $item)
    {
        $item->update([
            'status' => 'completed',
            'completed_date' => today()
        ]);

        $allCompleted = $item->treatmentPlan->treatmentItems()
            ->where('status', '!=', 'completed')
            ->count() === 0;

        if ($allCompleted) {
            $item->treatmentPlan->update([
                'status' => 'completed',
                'actual_end_date' => today()
            ]);
        }

        return $item;
    }

    public function getRemainingCost(TreatmentPlan $plan)
    {
        return $plan->total_cost - $plan->paid_amount;
    }
}
