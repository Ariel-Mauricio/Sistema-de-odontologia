<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreatmentItem extends Model
{
    use HasFactory;

    protected $table = 'treatment_items';

    protected $fillable = [
        'treatment_plan_id', 'treatment_name', 'description', 'tooth_number',
        'tooth_status', 'cost', 'status', 'planned_date', 'completed_date', 'notes'
    ];

    protected $casts = [
        'planned_date' => 'date',
        'completed_date' => 'date',
    ];

    public function treatmentPlan()
    {
        return $this->belongsTo(TreatmentPlan::class);
    }
}
