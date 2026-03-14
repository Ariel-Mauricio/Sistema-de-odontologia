<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TreatmentPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id', 'doctor_id', 'clinic_id', 'name', 'description', 'start_date',
        'estimated_end_date', 'actual_end_date', 'status', 'total_cost', 'paid_amount', 'notes'
    ];

    protected $casts = [
        'start_date' => 'date',
        'estimated_end_date' => 'date',
        'actual_end_date' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function treatmentItems()
    {
        return $this->hasMany(TreatmentItem::class);
    }

    public function getRemainingAmount()
    {
        return $this->total_cost - $this->paid_amount;
    }
}
